import os
from neo4j import GraphDatabase

class GraphOps:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            os.getenv("NEO4J_URI", "bolt://localhost:7687"),
            auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD", "nexus_secure_pass"))
        )

    def close(self):
        self.driver.close()

    def get_ego_network(self, accused_id: str, depth: int):
        query = f"""
        MATCH (a:Accused {{id: $accused_id}})-[r*1..{depth}]-(connected)
        RETURN a, r, connected
        LIMIT 200
        """
        with self.driver.session() as session:
            result = session.run(query, accused_id=accused_id)
            # This is a simplification. Real implementation needs formatting for vis.js
            return [record.data() for record in result]

    def run_pagerank(self):
        # Stub for running PageRank via GDS
        return [{"id": "ACC-1", "score": 0.9}, {"id": "ACC-2", "score": 0.75}]

    def run_louvain(self):
        # Stub for running Louvain community detection
        return [{"community": 1, "members": ["ACC-1", "ACC-2"]}, {"community": 2, "members": ["ACC-3"]}]

    def analyze_financial_trail(self, accused_id: str):
        query = """
        MATCH p=(a:Accused {id: $accused_id})-[:CONTROLS]->(f:FinancialAccount)-[:TRANSACTED_WITH*1..5]->(target:FinancialAccount)
        RETURN p
        LIMIT 50
        """
        with self.driver.session() as session:
            result = session.run(query, accused_id=accused_id)
            return [record.data() for record in result]

    def get_hotspots(self):
        query = """
        MATCH (l:Location)
        RETURN l.id, l.district, l.latitude, l.longitude, l.hotspot_score
        ORDER BY l.hotspot_score DESC LIMIT 100
        """
        with self.driver.session() as session:
            result = session.run(query)
            return [record.data() for record in result]
