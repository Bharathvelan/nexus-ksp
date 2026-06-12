import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function CaseLookupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FIR Lookup</Text>
      
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Enter FIR ID (e.g., FIR-2023-089)"
          placeholderTextColor="#a1a1aa"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#18181b', marginTop: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#e4e4e7',
    marginRight: 10
  },
  searchButton: { 
    backgroundColor: '#000', 
    padding: 15, 
    borderRadius: 8,
    justifyContent: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
