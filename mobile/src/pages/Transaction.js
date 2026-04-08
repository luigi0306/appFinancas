import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import api from '../services/api';

export default function Transaction({ onBack, transactionData }) {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [type, setType] = useState('Receita');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const isEditing = !!transactionData;

    useEffect(() => {
        if (transactionData) {
            setDescription(transactionData.description || '');
            setValue(transactionData.value ? String(transactionData.value) : '');
            setType(transactionData.type_transaction || transactionData.type || 'Receita');
            setCategory(transactionData.category || '');
        }
    }, [transactionData]);

    async function handleSave() {
        if (!description || !value || !category) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                description,
                value: parseFloat(value.replace(',', '.')),
                type_transaction: type,
                category,
                date: transactionData ? transactionData.date : new Date(),
            };

            if (isEditing) {
                await api.put(`/transactions/${transactionData.id_transaction}`, payload);
                Alert.alert('Sucesso', 'Transação atualizada!');
            } else {
                await api.post('/transactions', payload);
                Alert.alert('Sucesso', 'Transação criada!');
            }
            onBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar barStyle="light-content" backgroundColor="#191919" />
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backBtnText}>← Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>{isEditing ? 'Editar' : 'Nova'} transação</Text>

                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeBtn, type === 'Receita' && styles.typeBtnActivePositive]}
                        onPress={() => setType('Receita')}
                    >
                        <Text style={[styles.typeBtnText, type === 'Receita' && styles.typeBtnTextActive]}>↑ Receita</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeBtn, type === 'Despesa' && styles.typeBtnActiveNegative]}
                        onPress={() => setType('Despesa')}
                    >
                        <Text style={[styles.typeBtnText, type === 'Despesa' && styles.typeBtnTextActive]}>↓ Despesa</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Salário, Aluguel..."
                        placeholderTextColor="#6B6B6B"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Valor (R$)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0,00"
                        placeholderTextColor="#6B6B6B"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={setValue}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Categoria</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Casa, Lazer, Comida..."
                        placeholderTextColor="#6B6B6B"
                        value={category}
                        onChangeText={setCategory}
                    />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={loading}>
                    <Text style={styles.submitBtnText}>{loading ? 'Salvando...' : 'Confirmar'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    content: {
        padding: 20,
        paddingTop: 50,
    },
    backBtn: {
        marginBottom: 16,
    },
    backBtnText: {
        color: '#6B6B6B',
        fontSize: 14,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#EBEBEB',
        marginBottom: 24,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    typeBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        backgroundColor: '#232323',
        alignItems: 'center',
    },
    typeBtnActivePositive: {
        backgroundColor: '#1B5E20',
    },
    typeBtnActiveNegative: {
        backgroundColor: '#B71C1C',
    },
    typeBtnText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B6B6B',
    },
    typeBtnTextActive: {
        color: '#EBEBEB',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#9E9E9E',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#232323',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        color: '#EBEBEB',
        borderWidth: 1,
        borderColor: '#333333',
    },
    submitBtn: {
        backgroundColor: '#EBEBEB',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 12,
    },
    submitBtnText: {
        color: '#191919',
        fontSize: 15,
        fontWeight: '600',
    },
});
