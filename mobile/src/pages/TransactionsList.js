import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, StatusBar, Modal, Pressable } from 'react-native';
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
                    params: { category: selectedCategory }
                });
                setTransactions(response.data.items || []);
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao carregar');
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = (id) => {
        Alert.alert(
            'Excluir',
            'Tem certeza?',
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
                            Alert.alert('Erro', 'Não foi possível excluir.');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.transactionCard}>
            <TouchableOpacity style={styles.cardContent} onPress={() => onEditTransaction(item)}>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.cat}>{item.category} • {formatDate(item.createdAt || item.date)}</Text>
            </TouchableOpacity>
            <View style={styles.cardRight}>
                <Text style={[
                    styles.amount,
                    item.type_transaction === 'Receita' ? styles.amountPositive : styles.amountNegative
                ]}>
                    {item.type_transaction === 'Receita' ? '+' : '-'} {formatMoney(item.value)}
                </Text>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id_transaction)}>
                    <Text style={styles.deleteText}>×</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#191919" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Histórico</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setIsPickerOpen(true)}>
                    <Text style={styles.filterBtnText}>{selectedCategory}</Text>
                    <Text style={styles.filterArrow}>▼</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isPickerOpen} transparent animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setIsPickerOpen(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtrar por categoria</Text>
                        {availableCategories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.modalOption, selectedCategory === cat && styles.modalOptionActive]}
                                onPress={() => {
                                    setSelectedCategory(cat);
                                    setIsPickerOpen(false);
                                }}
                            >
                                <Text style={[styles.modalOptionText, selectedCategory === cat && styles.modalOptionTextActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>

            <FlatList
                data={transactions}
                keyExtractor={(item, index) => String(item.id_transaction || index)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação</Text>}
                refreshing={loading}
                onRefresh={loadTransactions}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    backText: {
        color: '#6B6B6B',
        fontSize: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#EBEBEB',
    },
    filterContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    filterBtn: {
        backgroundColor: '#232323',
        borderRadius: 8,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterBtnText: {
        color: '#EBEBEB',
        fontSize: 14,
    },
    filterArrow: {
        color: '#6B6B6B',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#232323',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EBEBEB',
        marginBottom: 16,
    },
    modalOption: {
        padding: 14,
        borderRadius: 8,
    },
    modalOptionActive: {
        backgroundColor: '#333333',
    },
    modalOptionText: {
        color: '#9E9E9E',
        fontSize: 14,
    },
    modalOptionTextActive: {
        color: '#EBEBEB',
        fontWeight: '500',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
    },
    transactionCard: {
        backgroundColor: '#232323',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    desc: {
        fontSize: 15,
        fontWeight: '500',
        color: '#EBEBEB',
    },
    cat: {
        fontSize: 12,
        color: '#6B6B6B',
        marginTop: 4,
    },
    cardRight: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 14,
        fontWeight: '600',
    },
    amountPositive: {
        color: '#4CAF50',
    },
    amountNegative: {
        color: '#EF5350',
    },
    deleteBtn: {
        marginTop: 6,
        padding: 4,
    },
    deleteText: {
        fontSize: 20,
        color: '#6B6B6B',
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: '#6B6B6B',
        fontSize: 14,
    },
});
