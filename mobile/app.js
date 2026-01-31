import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './src/services/api';

import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboards';
import Profile from './src/pages/Profile';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // useEffect é como o "onInit" ou "constructor". Roda assim que o App abre.
  useEffect(() => {
    async function loadStorageData() {
      // Busca os dados salvos
      const storedToken = await AsyncStorage.getItem('@MyFinance:token');
      const storedUser = await AsyncStorage.getItem('@MyFinance:user');

      if (storedToken && storedUser) {
        // Se achou, configura o Axios e define o usuário
        api.defaults.headers.authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function logout() {
    await AsyncStorage.clear(); // Limpa tudo
    setUser(null);
  }

  // Se estiver carregando (lendo o disco), mostra uma bolinha girando
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (!user) {
    return (
      <Login onSignIn={setUser} />
    )
  }

  if (page === 'profile') {
    return (
      <Profile
        user={user}
        onBack={() => setPage('dashboard')} // Função para voltar
      />
    );
  }

  // Padrão: Mostra Dashboard
  return (
    <Dashboard
      user={user}
      onLogout={logout}
      onProfile={() => setPage('profile')} // Função para ir
    />
  )
}