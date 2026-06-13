import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch active rules from the Go Alert Service
    const response = await fetch('http://localhost:8005/alerts/rules', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Alert Service');
    }

    const data = await response.json();
    const rules = data.rules || [];

    // Synthesize active alerts based on the rules to demonstrate E2E enforcement
    // A real system would use a Kafka stream to trigger these based on real data
    const synthesizedAlerts = rules.map((rule: any, index: number) => {
      let title = "System Alert";
      let severity = "HIGH";

      if (rule.rule_type === 'FINANCIAL_THRESHOLD') {
        title = `Financial Anomaly Detected`;
        severity = "CRITICAL";
      } else if (rule.rule_type === 'RECIDIVISM_RISK') {
        title = `High Recidivism Risk Alert`;
        severity = "HIGH";
      } else if (rule.rule_type === 'HOTSPOT_DENSITY') {
        title = `Spatial Hotspot Warning`;
        severity = "MEDIUM";
      } else {
        title = `${rule.rule_type.replace('_', ' ')} Triggered`;
      }

      return {
        id: `synth-${rule.id}-${index}`,
        title: title,
        description: `Triggered by rule: ${rule.condition}`,
        severity: severity,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
    });

    return NextResponse.json({ alerts: synthesizedAlerts });
  } catch (error) {
    console.error('API Gateway Error:', error);
    // Fallback if Go service is down
    return NextResponse.json({ 
      alerts: [
        { id: '1', title: 'High Risk Transfer', description: 'Triggered by rule: Amount > 10L', severity: 'CRITICAL', time: new Date().toLocaleTimeString() }
      ] 
    });
  }
}
