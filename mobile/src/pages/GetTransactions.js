import React, { useState, useEffect } from 'react'; // Adicionado useState e useEffect
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import api from '../services/api';

export default function GetTransactions({ user, onBack }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Carrega as transações ao montar o componente
    useEffect(() => {
        loadTransactions();
    }, []);

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
            // No futuro, passaremos filtros aqui: api.get('/transactions', { params: { category: '...' } })
            const response = await api.get('/transactions');
            console.log("RAIO-X DA TRANSAÇÃO:", JSON.stringify(response.data, null, 2));
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível carregar as transações.');
        } finally {
            setLoading(false);
        }
    }

    // 2. Componente que renderiza cada linha da lista
    const renderItem = ({ item }) => (
        <View style={styles.transactionCard}>
            <View style={styles.leftContent}>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.cat}>{item.category} • {formatDate(item.createdAt || item.date)}</Text>
            </View>
            <Text style={[
                styles.amount, 
                { color: item.type_transaction === 'Receita' ? '#2e7d32' : '#c62828' }
            ]}>
                {item.type_transaction === 'Receita' ? '+' : '-'} {formatMoney(item.value)}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Histórico</Text>

            {/* Aqui entrarão seus filtros futuramente */}
            <View style={styles.filterBar}>
                <Text style={styles.filterText}>Mostrando todas as transações</Text>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => String(item.id_transaction || item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<Text style={styles.empty}>Nenhuma transação encontrada.</Text>}
                refreshing={loading}
                onRefresh={loadTransactions} // Puxe para baixo para atualizar!
            />

            <TouchableOpacity style={styles.button} onPress={onBack}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f2f5', paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    filterBar: { marginBottom: 15, padding: 10, backgroundColor: '#e0e0e0', borderRadius: 8 },
    filterText: { fontSize: 12, color: '#666', textAlign: 'center' },
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
    amount: { fontSize: 16, fontWeight: 'bold' },
    button: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});