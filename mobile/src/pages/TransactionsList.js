import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

export default function TransactionsList({ user, onBack, onEditTransaction }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    useEffect(() => {
        async function fetchUniqueCategories() {
            try {
                const response = await api.get('/transactions/categories');
                setAvailableCategories(['Todas', ...response.data]);
            } catch (error) {
                console.log("Erro ao buscar categorias", error);
            }
        }
        fetchUniqueCategories();
    }, []);

    useEffect(() => {
        loadTransactions();
    }, [selectedCategory]);

    const formatDate = (dateString) => {
        if (!dateString) return '--/--/----';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatMoney = (value) => {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    async function loadTransactions() {
        try {
            setLoading(true);

            let response;
            if (selectedCategory === 'Todas') {
                response = await api.get('/transactions');
                setTransactions(response.data.transactions || []);
            } else {
                response = await api.get('/transactions/report/categories', {
                    params: {
                        category: selectedCategory
                    }
                });
                console.log(response.data.items);
                setTransactions(response.data.items || []);
            }

        } catch (error) {
            Alert.alert('Erro', 'Falha ao filtrar');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = (id) => {
        Alert.alert(
            'Excluir Transação',
            'Tem certeza que deseja excluir esta transação?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/transactions/${id}`);
                            setTransactions(prev => prev.filter(t => t.id_transaction !== id));
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir a transação.');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.transactionCard}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => onEditTransaction(item)}
            >
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.cat}>{item.category} • {formatDate(item.createdAt || item.date)}</Text>
            </TouchableOpacity>
            <Text style={[
                styles.amount,
                { color: item.type_transaction === 'Receita' ? '#2e7d32' : '#c62828' }
            ]}>
                {item.type_transaction === 'Receita' ? '+' : '-'} {formatMoney(item.value)}
            </Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id_transaction)}
            >
                <MaterialIcons name="delete-outline" size={26} color="#d32f2f" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Histórico</Text>

            {/* Container do Filtro */}
            <View style={styles.filterWrapper}>
                <Text style={styles.label}>Filtrar por Categoria:</Text>

                <TouchableOpacity
                    style={styles.selectBox}
                    onPress={() => setIsPickerOpen(!isPickerOpen)}
                >
                    <Text style={styles.selectBoxText}>{selectedCategory}</Text>
                    <Text style={styles.arrow}>{isPickerOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isPickerOpen && (
                    <View style={styles.optionsContainer}>
                        {availableCategories.map((cat, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionItem,
                                    selectedCategory === cat && styles.activeOptionItem
                                ]}
                                onPress={() => {
                                    setSelectedCategory(cat);
                                    setIsPickerOpen(false);
                                }}
                            >
                                <Text style={[
                                    styles.optionText,
                                    selectedCategory === cat && styles.activeOptionText
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <FlatList
                data={transactions}
                scrollEnabled={!isPickerOpen} // <--- SE O MENU TÁ ABERTO, A LISTA TRAVA
                keyExtractor={(item, index) => String(item.id_transaction || index)}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80 }} // Espaço para não cobrir o botão voltar
                ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação encontrada.</Text>}
                refreshing={loading}
                onRefresh={loadTransactions}
            />

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.buttonText}>Voltar para o Dashboard</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f2f5',
        paddingTop: 50
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    filterWrapper: {
        marginBottom: 20,
        zIndex: 10, // Garante que a box flutue sobre a lista
        elevation: 10,
        position: 'relative'
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5
    },
    selectBox: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectBoxText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    arrow: {
        fontSize: 12,
        color: '#666'
    },
    optionsContainer: {
        position: 'absolute',
        top: 75,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        zIndex: 5000,
        elevation: 100,
        overflow: 'hidden',
    },
    optionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    activeOptionItem: {
        backgroundColor: '#e8f5e9',
    },
    optionText: {
        fontSize: 14,
        color: '#666',
    },
    activeOptionText: {
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    transactionCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1
    },
    desc: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    cat: { fontSize: 12, color: '#999', marginTop: 2 },
    amount: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8 },
    deleteButton: {
        padding: 6,
        marginLeft: 4,
    },
    deleteButtonText: {
        fontSize: 18,
    },
    backButton: {
        backgroundColor: '#2e7d32',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});