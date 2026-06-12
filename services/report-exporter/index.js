require('dotenv').config({ path: '../../.env.example' });
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

const PORT = process.env.PORT_REPORT_EXPORTER || 8007;

async function generatePDF(htmlContent) {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
}

app.post('/export/conversation', async (req, res) => {
    const { session_id, include_evidence_chain } = req.body;

    // Stub: Fetch actual conversation from Redis in production
    const htmlContent = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; color: #0F1B3D; }
                .header { text-align: center; border-bottom: 2px solid #C9A84C; padding-bottom: 20px; }
                .title { font-size: 24px; font-weight: bold; }
                .meta { color: #666; font-size: 12px; margin-top: 10px; }
                .disclaimer { border: 1px solid red; background: #ffeeee; padding: 10px; margin-top: 20px; font-size: 11px; }
                .qna { margin-top: 20px; }
                .user { font-weight: bold; color: #1a73e8; }
                .bot { margin-top: 5px; margin-bottom: 20px; }
                .citations { font-size: 10px; color: #555; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">NEXUS-KSP Intelligence Report</div>
                <div class="meta">Generated: ${new Date().toLocaleString()} | Session: ${session_id}</div>
            </div>
            <div class="disclaimer">
                <strong>CONFIDENTIAL & PROPRIETARY</strong><br>
                This report contains AI-assisted analysis and is subject to human verification. 
                Do not use as sole evidence in legal proceedings.
            </div>
            <div class="qna">
                <div class="user">Investigator: Show me hotspots in Bangalore Urban</div>
                <div class="bot">
                    Based on recent data, Koramangala and Indiranagar are emerging hotspots. 
                    <div class="citations">Sources: [FIR-8821], [FIR-9923]</div>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        const pdf = await generatePDF(htmlContent);
        res.contentType("application/pdf");
        res.send(pdf);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/export/case-summary', async (req, res) => {
    const { fir_id } = req.body;

    const htmlContent = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { text-align: center; border-bottom: 2px solid #C9A84C; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Case Summary: ${fir_id}</h2>
            </div>
            <p>Automated summary generation for case file...</p>
        </body>
        </html>
    `;

    try {
        const pdf = await generatePDF(htmlContent);
        res.contentType("application/pdf");
        res.send(pdf);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'report-exporter' });
});

app.listen(PORT, () => {
    console.log(`Report Exporter listening on port ${PORT}`);
});
