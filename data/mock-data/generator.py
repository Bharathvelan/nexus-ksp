import os
import random
import uuid
import json
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values
from neo4j import GraphDatabase
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from faker import Faker
from dotenv import load_dotenv

# Load env variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env.example'))

# Configuration
NUM_FIRS = 10000
NUM_ACCUSED = 5000
NUM_REPEAT_OFFENDERS = 500
NUM_SYNDICATES = 20
NUM_TRANSACTIONS = 50000

KARNATAKA_DISTRICTS = [
    "Bangalore Urban", "Bangalore Rural", "Mysore", "Dakshina Kannada", 
    "Belagavi", "Hubli-Dharwad", "Kalaburagi", "Mangaluru", "Tumakuru", "Udupi",
    "Ballari", "Vijayapura", "Shivamogga", "Raichur", "Bidar", "Hassan",
    "Koppal", "Yadgir", "Chikkaballapur", "Ramanagara", "Chitradurga",
    "Davanagere", "Kolar", "Mandya", "Chamarajanagar", "Bagalkot",
    "Gadag", "Haveri", "Kodagu", "Uttara Kannada"
]

CRIME_TYPES = ["Theft", "Cyber Crime", "Assault", "Fraud", "Narcotics", "Homicide", "Extortion", "Kidnapping"]
STATUS_OPTIONS = ["OPEN", "UNDER_INVESTIGATION", "CLOSED", "CHARGE_SHEET_FILED"]

fake = Faker('en_IN')

# Database connections
def get_pg_connection():
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        database=os.getenv("POSTGRES_DB", "nexus_ksp"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "nexus_secure_pass"),
        port=os.getenv("POSTGRES_PORT", "5432")
    )

def get_neo4j_driver():
    return GraphDatabase.driver(
        os.getenv("NEO4J_URI", "bolt://localhost:7687"),
        auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD", "nexus_secure_pass"))
    )

def init_qdrant():
    client = QdrantClient(host=os.getenv("QDRANT_HOST", "localhost"), port=int(os.getenv("QDRANT_PORT", 6333)))
    collections = ["fir_narratives", "accused_profiles", "case_outcomes"]
    for col in collections:
        try:
            client.create_collection(
                collection_name=col,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
            )
            print(f"Created Qdrant collection: {col}")
        except Exception as e:
            print(f"Collection {col} might already exist: {e}")

def generate_mock_data():
    print("Starting Mock Data Generation...")
    
    # Generate Accused
    accused_data = []
    accused_ids = [str(uuid.uuid4()) for _ in range(NUM_ACCUSED)]
    for aid in accused_ids:
        accused_data.append((
            aid,
            fake.name(),
            [fake.first_name() for _ in range(random.randint(0, 2))], # alias
            fake.date_of_birth(minimum_age=18, maximum_age=65),
            random.choice(['M', 'F', 'O']),
            'Indian',
            fake.address(),
            fake.sha256(), # aadhaar hash
            f"https://fakeimg.pl/300x300/?text={aid[:4]}",
            random.uniform(0.0, 100.0), # risk_score
            0 # criminal_history_count (updated later)
        ))
    
    # Generate FIRs
    fir_data = []
    fir_ids = [str(uuid.uuid4()) for _ in range(NUM_FIRS)]
    for fid in fir_ids:
        lat = random.uniform(11.5, 18.5) # Karnataka approx bounds
        lng = random.uniform(74.0, 78.5)
        fir_data.append((
            fid,
            f"FIR/{random.randint(2020, 2024)}/{random.randint(1000, 9999)}",
            f"STN{random.randint(10, 99)}",
            random.choice(KARNATAKA_DISTRICTS),
            fake.date_time_between(start_date='-5y', end_date='now'),
            random.choice(CRIME_TYPES),
            [f"IPC {random.randint(100, 500)}" for _ in range(random.randint(1, 3))],
            random.choice(STATUS_OPTIONS),
            fake.text(max_nb_chars=500), # narrative
            lat,
            lng,
            f"SRID=4326;POINT({lng} {lat})",
            str(uuid.uuid4()) # IO id
        ))

    # Link FIRs to Accused
    fir_accused_data = []
    # Ensure repeat offenders
    repeat_offenders = random.sample(accused_ids, NUM_REPEAT_OFFENDERS)
    for ro_id in repeat_offenders:
        crimes = random.sample(fir_ids, random.randint(3, 8))
        for cid in crimes:
            fir_accused_data.append((
                cid, ro_id, random.choice(["Mastermind", "Accomplice", "Driver"]), fake.date_time_between(start_date='-1y', end_date='now'), "N/A"
            ))
            
    # Assign remaining FIRs randomly
    for fid in fir_ids:
        # Check if FIR already has accused
        if not any(f_a[0] == fid for f_a in fir_accused_data):
            if random.random() > 0.2: # 80% solve rate for mock
                num_accused = random.randint(1, 4)
                accused_sample = random.sample(accused_ids, num_accused)
                for a_id in accused_sample:
                    fir_accused_data.append((
                        fid, a_id, "Primary", fake.date_time_between(start_date='-1y', end_date='now'), "N/A"
                    ))

    # Generate Financial Transactions
    fin_data = []
    for _ in range(NUM_TRANSACTIONS):
        aid = random.choice(accused_ids)
        flagged = random.random() < (200 / NUM_TRANSACTIONS) # ~200 suspicious
        fin_data.append((
            str(uuid.uuid4()), aid, random.uniform(100, 1000000), "INR",
            fake.date_time_between(start_date='-2y', end_date='now'),
            fake.bban(), fake.sha256(), flagged, "Rapid Transfer" if flagged else None
        ))

    print("Data generated in memory. Skipping actual DB insert because DBs are not running locally yet.")
    print("In a real run, this script would batch INSERT into PostgreSQL and Neo4j via Cypher.")
    
    # IMPORTANT: We stub the DB operations to prevent the script from crashing during local run when containers aren't up
    '''
    try:
        pg_conn = get_pg_connection()
        cursor = pg_conn.cursor()
        
        # INSERT accused
        execute_values(cursor, """
            INSERT INTO nexus.accused (id, name, alias, dob, gender, nationality, address, aadhaar_hash, photo_url, risk_score, criminal_history_count)
            VALUES %s
        """, accused_data)
        
        # INSERT FIRs
        execute_values(cursor, """
            INSERT INTO nexus.fir (id, fir_number, station_code, district, date_filed, crime_type, ipc_sections, status, description_text, latitude, longitude, geom, investigating_officer_id)
            VALUES %s
        """, fir_data)

        # INSERT FIR-Accused
        execute_values(cursor, "INSERT INTO nexus.fir_accused (fir_id, accused_id, role, arrest_date, bail_status) VALUES %s", fir_accused_data)
        
        # INSERT Financial
        execute_values(cursor, "INSERT INTO nexus.financial_transactions (id, accused_id, amount, currency, transaction_date, bank_code, account_hash, flagged, flag_reason) VALUES %s", fin_data)

        pg_conn.commit()
        cursor.close()
        pg_conn.close()
        print("PostgreSQL loading complete.")
    except Exception as e:
        print(f"Skipping Postgres load: {e}")
    '''

if __name__ == "__main__":
    init_qdrant()
    generate_mock_data()
    print("Mock data generation script completed.")
