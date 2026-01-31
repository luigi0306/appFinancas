import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function Dashboard({ user, onLogout, onProfile }) {
    const [balance, setBalance] = useState({ income: '0.00', outcome: '0.00', total: '0.00' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBalance() {
            try {
                // Chama a rota que calcula o saldo no Backend
                // O Axios já está enviando o Token automaticamente pelo api.js
                const response = await api.get('/transactions/balance');

                setBalance(response.data);

            } catch (error) {
                console.log("Erro ao buscar saldo:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }

        loadBalance();
    }, []);

    // Função auxiliar para formatar dinheiro (R$)
    const formatMoney = (value) => {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2e7d32" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* --- HEADER --- */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Olá, {user.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    {/* Botão de Perfil (Neutro) */}
                    <TouchableOpacity onPress={onProfile} style={{ marginRight: 20 }}>
                        <Text style={styles.profileText}>Perfil</Text>
                    </TouchableOpacity>

                    {/* Botão de Sair (Perigo/Ação Final) */}
                    <TouchableOpacity onPress={onLogout}>
                        <Text style={styles.logoutText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* CARD DE SALDO (Sempre aparece) */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Saldo Atual</Text>
                <Text style={styles.balance}>{formatMoney(balance.total)}</Text>
            </View>

            {/* LÓGICA CONDICIONAL DE UI */}
            {balance.count === 0 ? (

                // OPÇÃO A: EMPTY STATE (Usuário Novo)
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyMessage}>Você ainda não tem movimentações.</Text>
                    <TouchableOpacity style={styles.buttonAdd}>
                        <Text style={styles.buttonText}>Adicionar Primeira Transação</Text>
                    </TouchableOpacity>
                </View>

            ) : (

                // OPÇÃO B: DASHBOARD PADRÃO (Usuário Ativo)
                <View style={styles.row}>
                    <View style={styles.miniCard}>
                        <Text style={styles.label}>Entradas</Text>
                        <Text style={styles.income}>{formatMoney(balance.income)}</Text>
                    </View>
                    <View style={styles.miniCard}>
                        <Text style={styles.label}>Saídas</Text>
                        <Text style={styles.outcome}>{formatMoney(balance.outcome)}</Text>
                    </View>
                </View>

            )}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f2f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutText: {
        color: '#c62828',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    balance: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    miniCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        marginHorizontal: 5, // Ajuste para dar espaço entre os cards
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    income: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginTop: 5,
    },
    outcome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#c62828',
        marginTop: 5,
    },
    emptyStateContainer: { // Estilos novos para o caso de "Nenhuma transação"
        alignItems: 'center',
        marginTop: 20,
        padding: 20,
    },
    emptyMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    buttonAdd: {
        backgroundColor: '#2e7d32',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    profileText: {
        color: '#1976D2', // Azul para diferenciar do vermelho
        fontWeight: 'bold',
    }
});