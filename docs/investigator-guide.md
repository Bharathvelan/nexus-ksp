# NEXUS-KSP Investigator Guide

## Logging In
Navigate to `http://localhost:3000`. Enter your designated credentials (e.g., `demo@ksp.gov.in`).
Your jurisdiction is automatically enforced; you will only see data relevant to your assigned district unless you have state-level access.

## Using the AI Analyst Chat
The Chat interface allows you to query the entire platform using natural language.

**Example English Queries:**
- "Show me all active FIRs for two-wheeler theft in Koramangala this month."
- "Who are the associates of Accused ACC-1234?"
- "Analyze the financial trail of the mastermind behind FIR/2024/991."

**Example Kannada Queries:**
- "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕಳೆದ ವಾರ ನಡೆದ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ" (Show me theft cases in Bangalore from last week)

## Understanding Citations
Every piece of information provided by the AI is backed by a specific record. Look for tags like `[FIR-123]` or `[ACC-456]`. Click on "View Sources & Evidence" to see exactly which database (SQL, Graph, Vector) the AI queried.
