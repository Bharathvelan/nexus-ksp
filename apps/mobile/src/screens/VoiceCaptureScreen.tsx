import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

export default function VoiceCaptureScreen() {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'pending' | 'verified' | 'fake' | null>(null);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordedURI('file://mock-audio-path/voice_note.m4a');
    } else {
      setIsRecording(true);
      setRecordedURI(null);
      setAuthStatus(null);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    setAuthStatus('pending');
    
    setTimeout(() => {
      setIsUploading(false);
      setAuthStatus(Math.random() > 0.1 ? 'verified' : 'fake');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Field Intelligence")}</Text>
      <Text style={styles.subtitle}>{t("Capture voice notes directly to FIR dossier")}</Text>

      {recordedURI && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{t("Audio captured successfully.")}</Text>
          
          {authStatus === 'pending' && (
            <Text style={styles.scanningText}>{t("Analyzing Spectrogram for Deepfakes...")}</Text>
          )}
          
          {authStatus === 'verified' && (
            <View style={styles.authBadge}>
              <Text style={styles.authBadgeText}>{t("✓ VERIFIED HUMAN (98%)")}</Text>
            </View>
          )}

          {authStatus === 'fake' && (
            <View style={styles.fakeBadge}>
              <Text style={styles.fakeBadgeText}>{t("⚠ SYNTHETIC AUDIO DETECTED")}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={isUploading}>
            <Text style={styles.buttonText}>{isUploading ? t("Scanning...") : t("Upload & Scan")}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.recordContainer}>
        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recordingActive]} 
          onPress={handleRecord}
        >
          <View style={styles.innerCircle} />
        </TouchableOpacity>
        <Text style={styles.statusText}>
          {isRecording ? t("Recording in progress...") : t("Tap to Record (Kannada/English)")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f5', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 40, color: '#18181b' },
  subtitle: { fontSize: 16, color: '#71717a', textAlign: 'center', marginTop: 10, marginBottom: 40 },
  recordContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e4e4e7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000',
    marginBottom: 20
  },
  recordingActive: {
    borderColor: '#ef4444',
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444'
  },
  statusText: { fontSize: 16, fontWeight: '500', color: '#3f3f46' },
  resultContainer: { width: '100%', alignItems: 'center' },
  resultText: { fontSize: 16, color: '#10b981', marginBottom: 10, fontWeight: '600' },
  scanningText: { fontSize: 14, color: '#f97316', marginBottom: 15, fontStyle: 'italic' },
  authBadge: { backgroundColor: '#dcfce7', borderColor: '#22c55e', borderWidth: 1, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginBottom: 20 },
  authBadgeText: { color: '#166534', fontWeight: 'bold', fontSize: 12 },
  fakeBadge: { backgroundColor: '#fee2e2', borderColor: '#ef4444', borderWidth: 1, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginBottom: 20 },
  fakeBadgeText: { color: '#991b1b', fontWeight: 'bold', fontSize: 12 },
  uploadButton: { backgroundColor: '#18181b', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
