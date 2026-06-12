import os
import re
import json
import asyncio
from openai import AsyncOpenAI
import psycopg2
from neo4j import GraphDatabase
from qdrant_client import QdrantClient

from prompts import INTENT_CLASSIFIER_PROMPT, SQL_AGENT_PROMPT, CYPHER_AGENT_PROMPT, GROUNDING_PROMPT

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy_key"))

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

qdrant_client = QdrantClient(host=os.getenv("QDRANT_HOST", "localhost"), port=int(os.getenv("QDRANT_PORT", 6333)))

class AIAgents:
    @staticmethod
    async def classify_intent(query: str) -> str:
        prompt = INTENT_CLASSIFIER_PROMPT.format(query=query)
        try:
            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            intent = response.choices[0].message.content.strip().upper()
            valid_intents = ["RETRIEVAL", "GRAPH_ANALYSIS", "PATTERN_ANALYSIS", "PROFILING", "PREDICTION", "FINANCIAL", "MULTI_HOP"]
            return intent if intent in valid_intents else "RETRIEVAL"
        except Exception:
            return "RETRIEVAL"

    @staticmethod
    async def execute_sql_agent(query: str, history: str) -> dict:
        prompt = SQL_AGENT_PROMPT.format(query=query)
        try:
            # Generate SQL
            response = await client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            sql_query = response.choices[0].message.content.strip()
            # Clean markdown if present
            sql_query = re.sub(r'```sql|```', '', sql_query).strip()
            
            # Simple validation to block mutative queries
            if any(forbidden in sql_query.upper() for forbidden in ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER"]):
                return {"source": "sql", "data": "Error: Mutative queries are forbidden.", "query": sql_query}

            # Execute SQL
            conn = get_pg_connection()
            cur = conn.cursor()
            cur.execute(sql_query)
            # Fetch up to 100 rows to avoid token overflow
            rows = cur.fetchmany(100)
            col_names = [desc[0] for desc in cur.description]
            result = [dict(zip(col_names, row)) for row in rows]
            cur.close()
            conn.close()
            
            return {"source": "sql", "data": result, "query": sql_query}
        except Exception as e:
            return {"source": "sql", "data": f"Error executing SQL: {str(e)}", "query": "Failed to generate"}

    @staticmethod
    async def execute_graph_agent(query: str, history: str) -> dict:
        prompt = CYPHER_AGENT_PROMPT.format(query=query)
        try:
            response = await client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            cypher_query = response.choices[0].message.content.strip()
            cypher_query = re.sub(r'```cypher|```', '', cypher_query).strip()

            if any(forbidden in cypher_query.upper() for forbidden in ["CREATE", "MERGE", "DELETE", "SET", "REMOVE"]):
                return {"source": "graph", "data": "Error: Mutative queries are forbidden.", "query": cypher_query}

            driver = get_neo4j_driver()
            with driver.session() as session:
                result = session.run(cypher_query)
                records = [record.data() for record in result]
            driver.close()
            
            return {"source": "graph", "data": records, "query": cypher_query}
        except Exception as e:
            return {"source": "graph", "data": f"Error executing Cypher: {str(e)}", "query": "Failed to generate"}

    @staticmethod
    async def execute_vector_agent(query: str, history: str) -> dict:
        # Generate an embedding for the query.
        try:
            response = await client.embeddings.create(
                input=query,
                model="text-embedding-ada-002" # Fallback to openai for 1536 dims
            )
            vector = response.data[0].embedding
            
            # Search Qdrant
            hits = qdrant_client.search(
                collection_name="fir_narratives",
                query_vector=vector,
                limit=5
            )
            
            results = [{"score": hit.score, "payload": hit.payload} for hit in hits]
            return {"source": "vector", "data": results, "query": "Qdrant Search"}
        except Exception as e:
            return {"source": "vector", "data": f"Error in vector search: {str(e)}", "query": "Embedding failed"}

    @staticmethod
    async def synthesize_response(query: str, data_sources: list) -> dict:
        context_str = json.dumps(data_sources, default=str)
        prompt = GROUNDING_PROMPT.format(query=query, context=context_str)
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2
            )
            answer = response.choices[0].message.content.strip()
            
            # Extract citations (simple regex for [XYZ])
            citations = list(set(re.findall(r'\[([^\]]+)\]', answer)))
            
            return {
                "answer": answer,
                "citations": citations,
                "confidence": 0.85, # mock confidence
                "sources_used": [ds.get("source") for ds in data_sources]
            }
        except Exception as e:
            return {
                "answer": f"Error synthesizing response: {str(e)}",
                "citations": [],
                "confidence": 0.0,
                "sources_used": []
            }
