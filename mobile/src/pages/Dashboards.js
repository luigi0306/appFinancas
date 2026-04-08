import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import api from '../services/api';

export default function Dashboard({ user, onLogout, onProfile, onTransaction, onTransactionsList }) {
    const [balance, setBalance] = useState({ income: '0.00', outcome: '0.00', total: '0.00' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBalance() {
            try {
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

    const formatMoney = (value) => {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EBEBEB" />
            </View>
        );
    }

    const isPositive = parseFloat(balance.total) >= 0;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, {user.name}</Text>
                    <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={onProfile} style={styles.iconButton}>
                        <Text style={styles.profileIcon}>👤</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
                        <Text style={styles.exitText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Saldo total</Text>
                <Text style={[styles.balanceValue, isPositive ? styles.positive : styles.negative]}>
                    {formatMoney(balance.total)}
                </Text>
            </View>

            {balance.count === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>◉</Text>
                    <Text style={styles.emptyTitle}>Nenhuma transação ainda</Text>
                    <Text style={styles.emptyText}>Comece a registrar suas finanças</Text>
                    <TouchableOpacity style={styles.button} onPress={onTransaction}>
                        <Text style={styles.buttonText}>Adicionar transação</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Entradas</Text>
                            <Text style={styles.statValuePositive}>↑ {formatMoney(balance.income)}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Saídas</Text>
                            <Text style={styles.statValueNegative}>↓ {formatMoney(balance.outcome)}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.buttonPrimary} onPress={onTransaction}>
                        <Text style={styles.buttonPrimaryText}>+ Nova transação</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSecondary} onPress={onTransactionsList}>
                        <Text style={styles.buttonSecondaryText}>Ver histórico</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191919',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '600',
        color: '#EBEBEB',
    },
    date: {
        fontSize: 13,
        color: '#6B6B6B',
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 16,
    },
    profileIcon: {
        fontSize: 18,
    },
    exitText: {
        fontSize: 14,
        color: '#EF5350',
        fontWeight: '500',
    },
    balanceCard: {
        backgroundColor: '#232323',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    balanceLabel: {
        fontSize: 13,
        color: '#6B6B6B',
        marginBottom: 8,
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: '600',
    },
    positive: {
        color: '#4CAF50',
    },
    negative: {
        color: '#EF5350',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 48,
        color: '#333333',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#EBEBEB',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B6B6B',
        marginBottom: 24,
    },
    statsContainer: {
        gap: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#232323',
        borderRadius: 12,
        padding: 16,
    },
    statLabel: {
        fontSize: 13,
        color: '#6B6B6B',
        marginBottom: 8,
    },
    statValuePositive: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
    },
    statValueNegative: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF5350',
    },
    button: {
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    buttonText: {
        color: '#EBEBEB',
        fontSize: 14,
    },
    buttonPrimary: {
        backgroundColor: '#EBEBEB',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonPrimaryText: {
        color: '#191919',
        fontSize: 15,
        fontWeight: '600',
    },
    buttonSecondary: {
        backgroundColor: '#232323',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonSecondaryText: {
        color: '#EBEBEB',
        fontSize: 15,
        fontWeight: '500',
    },
});
