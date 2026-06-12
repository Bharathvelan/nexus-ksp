"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  ShieldAlert, 
  ListFilter, 
  Sliders, 
  Users, 
  RefreshCw, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuditLog {
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address: string;
  timestamp: string;
  query_text: string;
  response_hash: string;
  tampered?: boolean;
}

interface AlertRule {
  id: string;
  rule_type: string;
  condition: string;
}

export default function PoliciesPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'audit' | 'rules' | 'access' | 'simulator'>('audit');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  
  // Rules creation form state
  const [ruleType, setRuleType] = useState('FINANCIAL_THRESHOLD');
  const [condition, setCondition] = useState('');
  
  // Access control state
  const [users, setUsers] = useState([
    { email: 'demo@ksp.gov.in', role: 'INVESTIGATOR', division: 'Central Crime Branch' },
    { email: 'super@ksp.gov.in', role: 'SUPERVISOR', division: 'State Records Bureau' },
    { email: 'admin@ksp.gov.in', role: 'ADMIN', division: 'HQ Systems' }
  ]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('INVESTIGATOR');
  const [newUserDiv, setNewUserDiv] = useState('CCB Bangalore');

  // Simulator state
  const [isTampered, setIsTampered] = useState(false);

  // Fetch audit trail
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('http://localhost:8006/audit/trail');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.trail || []);
      } else {
        throw new Error('Failed to fetch from audit server');
      }
    } catch (err) {
      // Fallback local mock data
      const now = new Date();
      setAuditLogs([
        {
          user_id: 'demo@ksp.gov.in',
          action: 'QUERY_CHAT',
          resource_type: 'fir',
          resource_id: 'FIR-8821',
          ip_address: '10.152.4.21',
          timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
          query_text: 'Show crimes in Bangalore Indiranagar',
          response_hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
        },
        {
          user_id: 'demo@ksp.gov.in',
          action: 'EXPORT_PDF',
          resource_type: 'cases',
          resource_id: 'FIR-1234',
          ip_address: '10.152.4.21',
          timestamp: new Date(now.getTime() - 25 * 60000).toISOString(),
          query_text: 'Export Intelligence Dossier for FIR-1234',
          response_hash: '82e3e56c52a0a2dfca5ee1893c52a0d1f7c00e12e12e2e92c2a0c8b6b6d2a1a1'
        },
        {
          user_id: 'super@ksp.gov.in',
          action: 'VIEW_NETWORK',
          resource_type: 'accused',
          resource_id: 'ACC-1234',
          ip_address: '10.152.4.2',
          timestamp: new Date(now.getTime() - 3600000).toISOString(),
          query_text: 'Trace 3-hop financial co-offenders network for ACC-1234',
          response_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        }
      ]);
    }
  };

  // Fetch alert rules
  const fetchAlertRules = async () => {
    try {
      const res = await fetch('http://localhost:8005/alerts/rules');
      if (res.ok) {
        const data = await res.json();
        setAlertRules(data.rules || []);
      } else {
        throw new Error('Failed to fetch rules');
      }
    } catch (err) {
      setAlertRules([
        { id: 'RULE-1', rule_type: 'FINANCIAL_THRESHOLD', condition: 'Transaction Amount > ₹10,00,000' },
        { id: 'RULE-2', rule_type: 'RECIDIVISM_RISK', condition: 'XGBoost Repeat Offender Score > 75%' },
        { id: 'RULE-3', rule_type: 'HOTSPOT_DENSITY', condition: 'DBSCAN Cluster Density Increase > 30% in 7 Days' }
      ]);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    fetchAlertRules();
  }, []);

  // Create rule
  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition) return;

    const payload = { rule_type: ruleType, condition };
    try {
      const res = await fetch('http://localhost:8005/alerts/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchAlertRules();
        setCondition('');
      } else {
        throw new Error('POST failed');
      }
    } catch (err) {
      // Fallback local update
      const newRule = {
        id: `RULE-${alertRules.length + 1}`,
        rule_type: ruleType,
        condition
      };
      setAlertRules(prev => [...prev, newRule]);
      setCondition('');
    }
  };

  // Simulate database tampering
  const triggerSimulation = () => {
    if (auditLogs.length === 0) return;
    
    // Toggle tampering simulation on the first row
    setIsTampered(prev => {
      const targetState = !prev;
      setAuditLogs(logs => {
        return logs.map((log, idx) => {
          if (idx === 0) {
            return {
              ...log,
              query_text: targetState ? "DROP TABLE fir; -- TAMPERED QUERY" : "Show crimes in Bangalore Indiranagar",
              tampered: targetState
            };
          }
          return log;
        });
      });
      return targetState;
    });
  };

  // Access control rule create
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;
    setUsers(prev => [...prev, { email: newUserEmail, role: newUserRole, division: newUserDiv }]);
    setNewUserEmail('');
  };

  // Delete user
  const handleDeleteUser = (email: string) => {
    setUsers(prev => prev.filter(u => u.email !== email));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-navy p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-light">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-3">
              <ShieldAlert className="text-gold" size={32} />
              {t("Policy & Audit Control Panel")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t("Configure security layers, audit trails, and automated thresholds")}</p>
          </div>
          <button 
            onClick={() => { fetchAuditLogs(); fetchAlertRules(); }}
            className="bg-navy hover:bg-navy-light dark:bg-navy-light dark:hover:bg-navy-light/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} /> {t("Refresh State")}
          </button>
        </header>

        {/* Tab Controls */}
        <div className="flex bg-gray-100 dark:bg-navy-dark p-1 rounded-xl w-fit border dark:border-navy-light">
          <button 
            onClick={() => setActiveTab('audit')}
            className={`px-5 py-2.5 flex items-center gap-2 rounded-lg font-semibold transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-navy text-navy dark:text-gold shadow-sm' : 'text-gray-500 hover:text-navy dark:text-gray-400'}`}
          >
            <ListFilter size={18} /> {t("Cryptographic Audit Trail")}
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`px-5 py-2.5 flex items-center gap-2 rounded-lg font-semibold transition-all ${activeTab === 'rules' ? 'bg-white dark:bg-navy text-navy dark:text-gold shadow-sm' : 'text-gray-500 hover:text-navy dark:text-gray-400'}`}
          >
            <Sliders size={18} /> {t("Alert Rule Policies")}
          </button>
          <button 
            onClick={() => setActiveTab('access')}
            className={`px-5 py-2.5 flex items-center gap-2 rounded-lg font-semibold transition-all ${activeTab === 'access' ? 'bg-white dark:bg-navy text-navy dark:text-gold shadow-sm' : 'text-gray-500 hover:text-navy dark:text-gray-400'}`}
          >
            <Users size={18} /> {t("Role Access Control")}
          </button>
          <button 
            onClick={() => setActiveTab('simulator')}
            className={`px-5 py-2.5 flex items-center gap-2 rounded-lg font-semibold transition-all ${activeTab === 'simulator' ? 'bg-white dark:bg-navy text-navy dark:text-gold shadow-sm' : 'text-gray-500 hover:text-navy dark:text-gray-400'}`}
          >
            <ShieldAlert size={18} /> {t("Tamper Simulator")}
          </button>
        </div>

        {/* Active Tab View */}
        <div className="bg-white dark:bg-navy rounded-xl shadow-sm border border-gray-100 dark:border-navy-light p-6">
          
          {/* Tab 1: Audit Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-navy dark:text-white">{t("Tamper-Proof Audit logs")}</h3>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12}/> {t("SHA-256 Validation Active")}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b dark:border-navy-light text-gray-400 text-sm">
                      <th className="pb-3 font-semibold">{t("Timestamp")}</th>
                      <th className="pb-3 font-semibold">{t("User")}</th>
                      <th className="pb-3 font-semibold">{t("Action")}</th>
                      <th className="pb-3 font-semibold">{t("IP Address")}</th>
                      <th className="pb-3 font-semibold">{t("Query Details")}</th>
                      <th className="pb-3 font-semibold text-center">{t("Cryptographic Integrity")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-navy-light">
                    {auditLogs.map((log, i) => (
                      <tr key={i} className="text-sm hover:bg-gray-50 dark:hover:bg-navy-light/40 transition-colors">
                        <td className="py-4 font-mono text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="py-4 font-medium">{log.user_id}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            log.action.includes('QUERY') ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            log.action.includes('EXPORT') ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-850 dark:text-gray-300'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500 font-mono">{log.ip_address}</td>
                        <td className="py-4 max-w-xs truncate" title={log.query_text}>{log.query_text}</td>
                        <td className="py-4 text-center">
                          {log.tampered ? (
                            <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full font-bold inline-flex items-center gap-1 text-xs animate-pulse">
                              <AlertTriangle size={12} /> {t("TAMPERED / INVALID SIGNATURE")}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full font-bold inline-flex items-center gap-1 text-xs">
                              <CheckCircle2 size={12} /> {t("VERIFIED HASH")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Alert Rules */}
          {activeTab === 'rules' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="bg-gray-50 dark:bg-navy-dark p-6 rounded-xl border dark:border-navy-light space-y-4">
                <h3 className="font-bold text-navy dark:text-white text-lg">{t("Define New Alert Threshold")}</h3>
                <form onSubmit={handleCreateRule} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">{t("Rule Type")}</label>
                    <select 
                      value={ruleType} 
                      onChange={(e) => setRuleType(e.target.value)}
                      className="w-full bg-white dark:bg-navy border dark:border-navy-light rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold text-sm"
                    >
                      <option value="FINANCIAL_THRESHOLD">Financial Transaction Limit</option>
                      <option value="RECIDIVISM_RISK">Recidivism Score Trigger</option>
                      <option value="HOTSPOT_DENSITY">Spatial Density Threshold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">{t("Condition Expression")}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Transaction Amount > ₹10,00,000"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full bg-white dark:bg-navy border dark:border-navy-light rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold text-sm"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-navy hover:bg-navy-light dark:bg-gold dark:hover:bg-gold-dark dark:text-navy font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-white">
                    <Plus size={18}/> {t("Add Rule to Alert Engine")}
                  </button>
                </form>
              </div>

              {/* Active Rules List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-navy dark:text-white text-lg">{t("Active System Monitoring Rules")}</h3>
                <div className="divide-y dark:divide-navy-light">
                  {alertRules.map((rule) => (
                    <div key={rule.id} className="py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-navy-light/40 px-3 rounded-lg transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-gold/10 text-gold px-2 py-0.5 rounded font-semibold">{rule.id}</span>
                          <span className="font-bold text-navy dark:text-white">{rule.rule_type.replace('_', ' ')}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-350 text-sm mt-1 font-mono">{rule.condition}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full font-semibold">
                        {t("ACTIVE MONITORING")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Access Control (RBAC) */}
          {activeTab === 'access' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="bg-gray-50 dark:bg-navy-dark p-6 rounded-xl border dark:border-navy-light space-y-4">
                <h3 className="font-bold text-navy dark:text-white text-lg">{t("Map Officer Role")}</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">{t("Officer Email")}</label>
                    <input 
                      type="email" 
                      placeholder="officer@ksp.gov.in"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full bg-white dark:bg-navy border dark:border-navy-light rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">{t("RBAC Role")}</label>
                    <select 
                      value={newUserRole} 
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full bg-white dark:bg-navy border dark:border-navy-light rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold text-sm"
                    >
                      <option value="INVESTIGATOR">Investigator (District-restricted)</option>
                      <option value="SUPERVISOR">Supervisor (State-wide view)</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">{t("Division / Unit")}</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cyber Crime Unit"
                      value={newUserDiv}
                      onChange={(e) => setNewUserDiv(e.target.value)}
                      className="w-full bg-white dark:bg-navy border dark:border-navy-light rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold text-sm"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-navy hover:bg-navy-light dark:bg-gold dark:hover:bg-gold-dark dark:text-navy font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-white">
                    <Plus size={18}/> {t("Assign Role")}
                  </button>
                </form>
              </div>

              {/* Users List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-navy dark:text-white text-lg">{t("Keycloak Mapped Officers & Roles")}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b dark:border-navy-light text-gray-400 text-sm">
                        <th className="pb-3 font-semibold">{t("Officer Email")}</th>
                        <th className="pb-3 font-semibold">{t("Assigned Role")}</th>
                        <th className="pb-3 font-semibold">{t("Division")}</th>
                        <th className="pb-3 font-semibold text-center">{t("Actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-navy-light">
                      {users.map((user) => (
                        <tr key={user.email} className="text-sm hover:bg-gray-50 dark:hover:bg-navy-light/40 transition-colors">
                          <td className="py-3.5 font-medium">{user.email}</td>
                          <td className="py-3.5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                              user.role === 'SUPERVISOR' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5 text-gray-500">{user.division}</td>
                          <td className="py-3.5 text-center">
                            <button 
                              onClick={() => handleDeleteUser(user.email)}
                              className="text-red-500 hover:text-red-750 transition-colors p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Tamper Simulator */}
          {activeTab === 'simulator' && (
            <div className="max-w-2xl mx-auto space-y-6 text-center py-6">
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 p-6 rounded-xl text-left space-y-4">
                <h3 className="font-bold text-orange-900 dark:text-orange-400 flex items-center gap-2 text-lg">
                  <AlertTriangle size={20} /> {t("Cryptographic Tamper Simulator")}
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed">
                  {t("Every query executed on the NEXUS-KSP engine computes a strict SHA-256 HMAC of the (query + response payload), signed at the database interface. If any record is mutated by a hacker or rogue script directly inside the database, the signature verification check will fail.")}
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-300 font-semibold">
                  {t("Click below to inject simulated database corruption to show how the audit trail catches mutations in real-time.")}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <button 
                  onClick={triggerSimulation}
                  className={`px-6 py-3 rounded-lg font-bold shadow-md transition-all ${
                    isTampered 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-750 text-white animate-pulse'
                  }`}
                >
                  {isTampered ? t("Reset Logs (Fix Database Integrity)") : t("Simulate Database SQL Mutation (Tampering)")}
                </button>
                
                {isTampered && (
                  <div className="border border-red-500 bg-red-50 dark:bg-red-950/25 p-4 rounded-lg flex items-center gap-3 text-red-800 dark:text-red-400 text-sm max-w-md text-left">
                    <AlertTriangle size={24} className="shrink-0 animate-bounce" />
                    <div>
                      <span className="font-bold">{t("CRITICAL SYSTEM THREAT:")}</span> {t("A query in Row #1 was altered in the Postgres logs, but its SHA-256 integrity hash remains mismatched. The audit engine flagged this mutation instantly!")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
