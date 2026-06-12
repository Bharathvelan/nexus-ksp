// ==============================================================================
// NEXUS-KSP Neo4j Graph Schema & Constraints
// schema.cypher
// ==============================================================================

// 1. Constraints and Indices for Nodes

// Accused
CREATE CONSTRAINT accused_id_unique IF NOT EXISTS FOR (a:Accused) REQUIRE a.id IS UNIQUE;
CREATE INDEX accused_name_idx IF NOT EXISTS FOR (a:Accused) ON (a.name);

// Victim
CREATE CONSTRAINT victim_id_unique IF NOT EXISTS FOR (v:Victim) REQUIRE v.id IS UNIQUE;

// Crime (FIR)
CREATE CONSTRAINT crime_id_unique IF NOT EXISTS FOR (c:Crime) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT crime_fir_number_unique IF NOT EXISTS FOR (c:Crime) REQUIRE c.fir_number IS UNIQUE;
CREATE INDEX crime_type_idx IF NOT EXISTS FOR (c:Crime) ON (c.type);

// Location
CREATE CONSTRAINT location_id_unique IF NOT EXISTS FOR (l:Location) REQUIRE l.id IS UNIQUE;
CREATE INDEX location_district_idx IF NOT EXISTS FOR (l:Location) ON (l.district);

// FinancialAccount
CREATE CONSTRAINT fin_account_id_unique IF NOT EXISTS FOR (f:FinancialAccount) REQUIRE f.id IS UNIQUE;
CREATE INDEX fin_account_hash_idx IF NOT EXISTS FOR (f:FinancialAccount) ON (f.account_hash);

// Syndicate
CREATE CONSTRAINT syndicate_id_unique IF NOT EXISTS FOR (s:Syndicate) REQUIRE s.id IS UNIQUE;

// Officer
CREATE CONSTRAINT officer_id_unique IF NOT EXISTS FOR (o:Officer) REQUIRE o.id IS UNIQUE;


// 2. Graph Projections for GDS Algorithms
// Note: In practice, these are run via the Python driver during analysis,
// but we define them here to show the structure.

/*
// Co-offender network (for community detection)
CALL gds.graph.project(
    'coOffenderNetwork',
    'Accused',
    {
        ASSOCIATED_WITH: {
            type: 'ASSOCIATED_WITH',
            orientation: 'UNDIRECTED',
            properties: ['strength']
        }
    }
);

// Location-crime bipartite (for hotspot analysis)
CALL gds.graph.project(
    'locationCrimeNetwork',
    ['Crime', 'Location'],
    {
        OCCURRED_AT: {
            type: 'OCCURRED_AT',
            orientation: 'UNDIRECTED'
        }
    }
);

// Financial flow network (for money trail analysis)
CALL gds.graph.project(
    'financialFlowNetwork',
    'FinancialAccount',
    {
        TRANSACTED_WITH: {
            type: 'TRANSACTED_WITH',
            orientation: 'DIRECTED'
        }
    }
);
*/
