package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/joho/godotenv"
)

type AlertRule struct {
	ID        string `json:"id"`
	RuleType  string `json:"rule_type"`
	Condition string `json:"condition"`
}

type Alert struct {
	ID        string `json:"id"`
	AlertType string `json:"alert_type"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
}

func main() {
	godotenv.Load("../../.env.example")

	app := fiber.New()

	activeRules := []AlertRule{
		{ID: "RULE-1", RuleType: "FINANCIAL_THRESHOLD", Condition: "Transaction Amount > ₹10,00,000"},
		{ID: "RULE-2", RuleType: "RECIDIVISM_RISK", Condition: "XGBoost Repeat Offender Score > 75%"},
		{ID: "RULE-3", RuleType: "HOTSPOT_DENSITY", Condition: "DBSCAN Cluster Density Increase > 30% in 7 Days"},
	}

	// WebSocket middleware
	app.Use("/alerts/subscribe", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/alerts/subscribe", websocket.New(func(c *websocket.Conn) {
		// Stub WebSocket Hub
		log.Println("New WebSocket connection")
		for {
			mt, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				break
			}
			log.Printf("recv: %s", msg)
			err = c.WriteMessage(mt, msg)
			if err != nil {
				log.Println("write:", err)
				break
			}
		}
	}))

	app.Get("/alerts/rules", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"rules": activeRules})
	})

	app.Post("/alerts/rules", func(c *fiber.Ctx) error {
		rule := new(AlertRule)
		if err := c.BodyParser(rule); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}
		if rule.ID == "" {
			rule.ID = fmt.Sprintf("RULE-%d", len(activeRules)+1)
		}
		activeRules = append(activeRules, *rule)
		return c.JSON(fiber.Map{"status": "Rule created", "rule": rule})
	})

	app.Post("/alerts/trigger", func(c *fiber.Ctx) error {
		alert := new(Alert)
		if err := c.BodyParser(alert); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}
		// Stub: in real app, this broadcasts via Hub
		return c.JSON(fiber.Map{"status": "Alert triggered", "alert": alert})
	})

	app.Get("/alerts/history", func(c *fiber.Ctx) error {
		// Stub history
		history := []Alert{
			{ID: "ALT-1", AlertType: "HOTSPOT_EMERGING", Message: "New cluster forming in Koramangala", Timestamp: "2024-05-10T10:00:00Z"},
		}
		return c.JSON(fiber.Map{"history": history})
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "alert-service"})
	})

	port := os.Getenv("PORT_ALERT_SERVICE")
	if port == "" {
		port = "8005"
	}
	log.Fatal(app.Listen(":" + port))
}
