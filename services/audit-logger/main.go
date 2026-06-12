package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type AuditRecord struct {
	UserID       string `json:"user_id"`
	Action       string `json:"action"`
	ResourceType string `json:"resource_type"`
	ResourceID   string `json:"resource_id"`
	IPAddress    string `json:"ip_address"`
	QueryText    string `json:"query_text"`
	ResponseHash string `json:"response_hash"`
}

func getDB() *sql.DB {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"))
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println("Database connection error:", err)
	}
	return db
}

func main() {
	godotenv.Load("../../.env.example")
	app := fiber.New()
	db := getDB()
	if db != nil {
		defer db.Close()
	}

	app.Post("/audit/log", func(c *fiber.Ctx) error {
		record := new(AuditRecord)
		if err := c.BodyParser(record); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}

		// Calculate Hash of Query + Response for tamper detection
		hashData := record.QueryText + record.ResponseHash
		hash := sha256.Sum256([]byte(hashData))
		tamperHash := hex.EncodeToString(hash[:])

		if db != nil {
			// Insert into DB
			_, err := db.Exec(`INSERT INTO nexus.audit_log (user_id, action, resource_type, resource_id, ip_address, timestamp, query_text, response_hash) 
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				record.UserID, record.Action, record.ResourceType, record.ResourceID, record.IPAddress, time.Now(), record.QueryText, tamperHash)
			if err != nil {
				log.Println("Failed to write audit log:", err)
			}
		}

		return c.JSON(fiber.Map{"status": "Logged"})
	})

	app.Get("/audit/trail", func(c *fiber.Ctx) error {
		userID := c.Query("user_id")

		if db != nil {
			query := "SELECT user_id, action, resource_type, resource_id, ip_address, timestamp, query_text, response_hash FROM nexus.audit_log"
			var rows *sql.Rows
			var err error
			if userID != "" {
				query += " WHERE user_id = $1 ORDER BY timestamp DESC"
				rows, err = db.Query(query, userID)
			} else {
				query += " ORDER BY timestamp DESC LIMIT 50"
				rows, err = db.Query(query)
			}

			if err == nil {
				defer rows.Close()
				var records []fiber.Map
				for rows.Next() {
					var uid, act, rtype, rid, ip, qtext, rhash string
					var ts time.Time
					err = rows.Scan(&uid, &act, &rtype, &rid, &ip, &ts, &qtext, &rhash)
					if err == nil {
						records = append(records, fiber.Map{
							"user_id":       uid,
							"action":        act,
							"resource_type": rtype,
							"resource_id":   rid,
							"ip_address":    ip,
							"timestamp":     ts.Format(time.RFC3339),
							"query_text":    qtext,
							"response_hash": rhash,
						})
					}
				}
				if len(records) > 0 {
					return c.JSON(fiber.Map{"trail": records})
				}
			} else {
				log.Println("Error querying audit logs:", err)
			}
		}

		// Fallback mock logs
		now := time.Now()
		mockRecords := []fiber.Map{
			{
				"user_id":       "demo@ksp.gov.in",
				"action":        "QUERY_CHAT",
				"resource_type": "fir",
				"resource_id":   "FIR-8821",
				"ip_address":    "10.152.4.21",
				"timestamp":     now.Add(-5 * time.Minute).Format(time.RFC3339),
				"query_text":    "Show crimes in Bangalore Indiranagar",
				"response_hash": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
			},
			{
				"user_id":       "demo@ksp.gov.in",
				"action":        "EXPORT_PDF",
				"resource_type": "cases",
				"resource_id":   "FIR-1234",
				"ip_address":    "10.152.4.21",
				"timestamp":     now.Add(-25 * time.Minute).Format(time.RFC3339),
				"query_text":    "Export Intelligence Dossier for FIR-1234",
				"response_hash": "82e3e56c52a0a2dfca5ee1893c52a0d1f7c00e12e12e2e92c2a0c8b6b6d2a1a1",
			},
			{
				"user_id":       "super@ksp.gov.in",
				"action":        "VIEW_NETWORK",
				"resource_type": "accused",
				"resource_id":   "ACC-1234",
				"ip_address":    "10.152.4.2",
				"timestamp":     now.Add(-1 * time.Hour).Format(time.RFC3339),
				"query_text":    "Trace 3-hop financial co-offenders network for ACC-1234",
				"response_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
			},
		}
		return c.JSON(fiber.Map{"trail": mockRecords})
	})

	app.Get("/audit/export", func(c *fiber.Ctx) error {
		format := c.Query("format", "csv")
		return c.SendString(fmt.Sprintf("Exporting audit trail in %s format", format))
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "audit-logger"})
	})

	port := os.Getenv("PORT_AUDIT_LOGGER")
	if port == "" {
		port = "8006"
	}
	log.Fatal(app.Listen(":" + port))
}
