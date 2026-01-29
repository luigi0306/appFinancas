import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin() {
        console.log("Tentando conectar em:", api.defaults.baseURL); // Verificação de segurança
        try {
            const response = await api.post('/users/login', {
                email: email.trim(), // Remove espaços acidentais
                password: password
            });

            const { token, user } = response.data;
            Alert.alert('Sucesso', `Bem-vindo, ${user.name}!`);

        } catch (error) {
            // Se der erro de rede, o log vai nos dizer o motivo exato agora
            if (!error.response) {
                console.log("Erro de rede real:", error.message);
            } else {
                console.log("Erro do servidor:", error.response.data);
            }
            Alert.alert('Erro', 'Usuário ou senha inválidos.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu App de Finanças</Text>

            <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry // Para esconder a senha
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333'
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#2e7d32', // Um verde "financeiro"
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});