import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function Login({ onSignIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin() {
        if (!email.trim() || !password) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/users/login', {
                email: email.trim(),
                password: password
            });

            const { token, user } = response.data;
            await AsyncStorage.setItem('@MyFinance:token', token);
            await AsyncStorage.setItem('@MyFinance:user', JSON.stringify(user));
            api.defaults.headers.authorization = `Bearer ${token}`;
            onSignIn(user);
        } catch (error) {
            if (!error.response) {
                Alert.alert('Erro', 'Verifique sua conexão.');
            } else {
                Alert.alert('Erro', 'E-mail ou senha inválidos.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor="#191919" />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.logo}>◉</Text>
                    <Text style={styles.title}>Finanças</Text>
                    <Text style={styles.subtitle}>Controle suas finanças</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.formTitle}>Entrar</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="seu@email.com"
                            placeholderTextColor="#6B6B6B"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[styles.input, styles.passwordInput]}
                                placeholder="••••••••"
                                placeholderTextColor="#6B6B6B"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="password"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.eyeIcon}>
                                    {showPassword ? '◉' : '○'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#191919" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>Continuar</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>
                    Não tem conta? <Text style={styles.link}>Cadastre-se</Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logo: {
        fontSize: 40,
        color: '#EBEBEB',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#EBEBEB',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B6B6B',
    },
    form: {
        backgroundColor: '#232323',
        borderRadius: 12,
        padding: 24,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#EBEBEB',
        marginBottom: 24,
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
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        color: '#EBEBEB',
        borderWidth: 1,
        borderColor: '#333333',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
    },
    eyeButton: {
        position: 'absolute',
        right: 14,
        padding: 4,
    },
    eyeIcon: {
        fontSize: 16,
        color: '#6B6B6B',
    },
    button: {
        backgroundColor: '#EBEBEB',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#191919',
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        marginTop: 24,
        fontSize: 14,
        color: '#6B6B6B',
    },
    link: {
        color: '#EBEBEB',
        fontWeight: '500',
    },
});
