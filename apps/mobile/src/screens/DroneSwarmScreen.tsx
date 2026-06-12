import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DroneSwarmScreen({ navigation }: any) {
  const [deploying, setDeploying] = useState(false);
  const [status, setStatus] = useState('STANDBY');
  const [dronesActive, setDronesActive] = useState(0);

  const handleDeploy = () => {
    setDeploying(true);
    setStatus('DEPLOYING MICRO-SWARM...');
    
    let count = 0;
    const interval = setInterval(() => {
      count += 5;
      if (count <= 25) {
        setDronesActive(count);
      } else {
        clearInterval(interval);
        setStatus('SWARM ACTIVE: 25 NODES SCANNING');
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TACTICAL SWARM MODULE</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.radarContainer}>
        <View style={[styles.radarCircle, deploying && styles.radarActive]}>
          <View style={styles.radarInner}>
            <Text style={styles.droneCount}>{dronesActive}</Text>
            <Text style={styles.droneLabel}>ACTIVE NODES</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {!deploying ? (
          <TouchableOpacity style={styles.deployButton} onPress={handleDeploy}>
            <Text style={styles.buttonText}>AUTHORIZE SWARM DEPLOYMENT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.recallButton} onPress={() => {
            setDeploying(false);
            setDronesActive(0);
            setStatus('STANDBY');
          }}>
            <Text style={styles.buttonText}>RECALL SWARM</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { marginTop: 40, alignItems: 'center' },
  headerTitle: { color: '#3b82f6', fontSize: 24, fontWeight: 'bold', letterSpacing: 2 },
  statusText: { color: '#fff', fontSize: 14, marginTop: 10, fontFamily: 'monospace' },
  radarContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  radarCircle: { width: 300, height: 300, borderRadius: 150, borderWidth: 2, borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  radarActive: { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  radarInner: { alignItems: 'center' },
  droneCount: { color: '#fff', fontSize: 64, fontWeight: 'bold', fontFamily: 'monospace' },
  droneLabel: { color: '#9ca3af', fontSize: 16, letterSpacing: 1 },
  footer: { paddingBottom: 40 },
  deployButton: { backgroundColor: '#ef4444', padding: 20, borderRadius: 12, alignItems: 'center' },
  recallButton: { backgroundColor: '#3b82f6', padding: 20, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});
