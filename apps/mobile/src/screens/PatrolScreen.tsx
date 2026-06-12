import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export default function PatrolScreen({ route, navigation }: any) {
  const { t } = useLanguage();
  const [patrolPoint, setPatrolPoint] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would fetch the assigned hotspot for the current officer
    // Here we'll just mock the received assignment from the spatial engine
    setPatrolPoint({
      id: "HS-001",
      lat: 12.9716, 
      lng: 77.5946,
      risk_score: 92,
      instructions: t("Proceed to Bangalore Central. High probability of property crime based on DBSCAN predictive spatial model.")
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t("Active Patrol Route")}</Text>
      
      {patrolPoint ? (
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.targetId}>{t("TARGET:")} {patrolPoint.id}</Text>
            <Text style={styles.riskBadge}>{patrolPoint.risk_score} {t("RISK")}</Text>
          </View>
          
          <View style={styles.mapMock}>
            <Text style={styles.mapText}>{t("[ Map UI Rendering Area ]")}</Text>
            <Text style={styles.coordText}>Lat: {patrolPoint.lat}, Lng: {patrolPoint.lng}</Text>
          </View>

          <Text style={styles.instructionsTitle}>{t("AI Dispatch Instructions:")}</Text>
          <Text style={styles.instructionsText}>{patrolPoint.instructions}</Text>

          <TouchableOpacity style={styles.enRouteBtn} onPress={() => alert(t('Dispatch Confirmed'))}>
            <Text style={styles.btnText}>{t("CONFIRM EN ROUTE")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.loading}>{t("Awaiting dispatch coordinates...")}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#18181b', marginTop: 40 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  targetId: { fontSize: 18, fontWeight: 'bold', color: '#18181b' },
  riskBadge: { backgroundColor: '#ef4444', color: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontWeight: 'bold' },
  mapMock: { height: 200, backgroundColor: '#e4e4e7', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#d4d4d8' },
  mapText: { color: '#71717a', fontWeight: 'bold' },
  coordText: { color: '#52525b', marginTop: 10, fontFamily: 'monospace' },
  instructionsTitle: { fontSize: 16, fontWeight: '600', color: '#3f3f46', marginBottom: 5 },
  instructionsText: { fontSize: 14, color: '#52525b', lineHeight: 22, marginBottom: 30 },
  enRouteBtn: { backgroundColor: '#000', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loading: { color: '#71717a', textAlign: 'center', marginTop: 40 }
});
