import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

export default function Profile({ user, onBack }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Data não disponível';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#191919" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Perfil</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
                </View>

                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tipo de acesso</Text>
                        <Text style={styles.infoValue}>{user.role || 'Usuário'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cadastro</Text>
                        <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
                    </View>
                </View>
            </View>
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
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '600',
        color: '#EBEBEB',
    },
    userName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#EBEBEB',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#6B6B6B',
        marginBottom: 32,
    },
    infoCard: {
        backgroundColor: '#232323',
        borderRadius: 12,
        padding: 20,
        width: '100%',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B6B6B',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#EBEBEB',
    },
    divider: {
        height: 1,
        backgroundColor: '#333333',
    },
});
