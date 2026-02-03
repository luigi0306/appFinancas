import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import api from '../services/api';

export default function Transaction({ onBack }) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('Receita'); // Padrão
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!description || !value || !category) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/transactions', {
        description,
        value: parseFloat(value.replace(',', '.')), // Garante formato decimal
        type_transaction: type,
        category,
        date: new Date(), // Por enquanto, salva com a data atual
      });

      Alert.alert('Sucesso', 'Transação salva com sucesso!');
      onBack(); // Volta para o Dashboard para ver o saldo atualizado
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Transação</Text>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity 
          style={[styles.typeButton, type === 'Receita' && styles.selectedIncome]} 
          onPress={() => setType('Receita')}
        >
          <Text style={type === 'Receita' ? styles.typeTextSelected : styles.typeText}>Receita</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeButton, type === 'Despesa' && styles.selectedOutcome]} 
          onPress={() => setType('Despesa')}
        >
          <Text style={type === 'Despesa' ? styles.typeTextSelected : styles.typeText}>Despesa</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: Aluguel, Salário..." 
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0,00" 
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: Casa, Lazer, Comida..." 
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Confirmar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f2f5', flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  label: { fontSize: 16, color: '#333', marginBottom: 5, fontWeight: '500' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, fontSize: 16, elevation: 1 },
  typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  typeButton: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 8, backgroundColor: '#ddd', marginHorizontal: 5 },
  selectedIncome: { backgroundColor: '#2e7d32' },
  selectedOutcome: { backgroundColor: '#c62828' },
  typeText: { color: '#666', fontWeight: 'bold' },
  typeTextSelected: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#2e7d32', padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  backButton: { marginTop: 15, alignItems: 'center' },
  backButtonText: { color: '#666', fontSize: 16 }
});