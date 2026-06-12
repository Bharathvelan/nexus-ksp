import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { apiClient } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomeScreen({ navigation }: any) {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    const data = await apiClient.getAlerts();
    setAlerts(data);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
    // Poll every 10 seconds to show dynamic updates from the web dashboard
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Officer Dashboard")}</Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('VoiceCapture')}
        >
          <Text style={styles.buttonText}>{t("Capture Intel")}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('CaseLookup')}
        >
          <Text style={styles.buttonText}>{t("FIR Lookup")}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.swarmButton} 
        onPress={() => navigation.navigate('DroneSwarm')}
      >
        <Text style={styles.dispatchButtonText}>{t("DEPLOY TACTICAL SWARM")}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.arButton} 
        onPress={() => navigation.navigate('ARScanner')}
      >
        <Text style={styles.dispatchButtonText}>{t("LAUNCH AR CRIME SCANNER")}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.dispatchButton} 
        onPress={() => navigation.navigate('Patrol')}
      >
        <Text style={styles.dispatchButtonText}>{t("PROCEED TO AI DISPATCH")}</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.subtitle}>{t("Active Alerts")}</Text>
        <Text style={styles.liveIndicator}>● {t("LIVE")}</Text>
      </View>
      
      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("No active alerts. Policies are clear.")}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>{t(item.title)}</Text>
              <Text style={[styles.badge, item.severity === 'CRITICAL' ? styles.criticalBadge : item.severity === 'HIGH' ? styles.highBadge : styles.mediumBadge]}>
                {t(item.severity)}
              </Text>
            </View>
            <Text style={styles.alertDesc}>{t(item.description)}</Text>
            <Text style={styles.alertTime}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#18181b', marginTop: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  subtitle: { fontSize: 20, fontWeight: '600', color: '#3f3f46' },
  liveIndicator: { color: '#ef4444', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionButton: { 
    flex: 1, 
    backgroundColor: '#000', 
    padding: 15, 
    borderRadius: 12, 
    marginHorizontal: 5,
    alignItems: 'center' 
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  swarmButton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  arButton: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  dispatchButton: { backgroundColor: '#ef4444', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  dispatchButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  alertCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertTitle: { fontSize: 16, fontWeight: '600', color: '#18181b', flex: 1, marginRight: 10 },
  alertDesc: { fontSize: 14, color: '#52525b', marginTop: 5, fontStyle: 'italic' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold', color: '#fff' },
  criticalBadge: { backgroundColor: '#ef4444' },
  highBadge: { backgroundColor: '#f97316' },
  mediumBadge: { backgroundColor: '#eab308' },
  alertTime: { fontSize: 12, color: '#71717a', marginTop: 8, textAlign: 'right' },
  emptyText: { textAlign: 'center', color: '#a1a1aa', marginTop: 20, fontStyle: 'italic' }
});
