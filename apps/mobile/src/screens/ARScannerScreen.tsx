import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ARScannerScreen({ navigation }: any) {
  const [isScanning, setIsScanning] = useState(true);
  const [evidenceFound, setEvidenceFound] = useState<any[]>([]);

  useEffect(() => {
    // Simulate AR scanning process
    const timer1 = setTimeout(() => {
      setEvidenceFound(prev => [...prev, { id: 'EV-01', type: 'Thermal Residue', confidence: 94, coords: 'N 12.9716, E 77.5946' }]);
    }, 3000);

    const timer2 = setTimeout(() => {
      setEvidenceFound(prev => [...prev, { id: 'EV-02', type: 'Hidden Electronic Signature', confidence: 88, coords: 'N 12.9718, E 77.5941' }]);
      setIsScanning(false);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Simulated Camera View Background */}
      <View style={styles.cameraSim}>
        {/* AR Scanning Grid overlay */}
        <View style={styles.gridOverlay}>
          {isScanning && <View style={styles.scanLine} />}
        </View>

        {/* HUD Elements */}
        <View style={styles.hudTop}>
          <Text style={styles.hudText}>AR SENSOR: ACTIVE</Text>
          <Text style={styles.hudText}>ENV: NIGHT VISION / THERMAL</Text>
        </View>

        {/* Target Reticle */}
        <View style={styles.reticle}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>

        {/* Evidence Markers */}
        {evidenceFound.map((ev, index) => (
          <View key={ev.id} style={[styles.evidenceMarker, { top: 150 + (index * 100), left: 50 + (index * 80) }]}>
            <View style={styles.dot} />
            <View style={styles.infoBox}>
              <Text style={styles.evId}>{ev.id} MATCH</Text>
              <Text style={styles.evType}>{ev.type}</Text>
              <Text style={styles.evCoords}>{ev.coords}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottomPanel}>
        <Text style={styles.panelTitle}>
          {isScanning ? 'SCANNING SECTOR...' : 'SCAN COMPLETE - 2 ITEMS FOUND'}
        </Text>
        <TouchableOpacity 
          style={[styles.syncButton, isScanning && styles.syncDisabled]} 
          disabled={isScanning}
          onPress={() => alert('Evidence synced to FIR Dossier via GraphQL.')}
        >
          <Text style={styles.syncBtnText}>SYNC EVIDENCE TO DOSSIER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraSim: { flex: 1, backgroundColor: '#022c22', position: 'relative' }, // Dark green night vision mock
  gridOverlay: { ...StyleSheet.absoluteFill, borderWidth: 1, borderColor: '#059669', opacity: 0.2 },
  scanLine: { width: '100%', height: 2, backgroundColor: '#10b981', position: 'absolute', top: '50%', shadowColor: '#10b981', shadowOpacity: 1, shadowRadius: 10 },
  hudTop: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, zIndex: 10 },
  hudText: { color: '#10b981', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' },
  reticle: { position: 'absolute', top: '30%', left: '20%', right: '20%', bottom: '30%', justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#10b981' },
  tl: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
  evidenceMarker: { position: 'absolute', flexDirection: 'row', alignItems: 'center', zIndex: 20 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ef4444', borderWidth: 2, borderColor: '#fff' },
  infoBox: { backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, marginLeft: 10, borderRadius: 4, borderWidth: 1, borderColor: '#ef4444' },
  evId: { color: '#ef4444', fontWeight: 'bold', fontSize: 10 },
  evType: { color: '#fff', fontSize: 12, marginVertical: 2 },
  evCoords: { color: '#10b981', fontSize: 10, fontFamily: 'monospace' },
  bottomPanel: { backgroundColor: '#18181b', padding: 25, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#27272a' },
  panelTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  syncButton: { backgroundColor: '#ef4444', padding: 18, borderRadius: 8, alignItems: 'center' },
  syncDisabled: { backgroundColor: '#52525b' },
  syncBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
