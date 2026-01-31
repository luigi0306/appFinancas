import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


export default function Profile({ user, onBack }) {

    console.log("RAIO-X DO USUARIO:", JSON.stringify(user, null, 2));

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não disponível';

        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR'); // Retorna 27/01/2026
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>

            <View style={styles.infoCard}>
                <Text style={styles.label}>Nome:</Text>
                <Text style={styles.value}>{user.name}</Text>

                <Text style={styles.label}>E-mail:</Text>
                <Text style={styles.value}>{user.email}</Text>

                <Text style={styles.label}>Tipo de acesso:</Text>
                <Text style={styles.value}>{user.role}</Text>

                <Text style={styles.label}>Data de Cadastro:</Text>
                <Text style={styles.value}>{formatDate(user.createdAt)}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={onBack}>
                <Text style={styles.buttonText}>Voltar para o Dashboard</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f0f2f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20, elevation: 2 },
    label: { fontSize: 14, color: '#666', marginTop: 10 },
    value: { fontSize: 18, color: '#333', fontWeight: 'bold' },
    button: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});