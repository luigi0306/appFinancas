import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './src/services/api';

import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboards';
import Profile from './src/pages/Profile';
import Transaction from './src/pages/Transaction';
import TransactionsList from './src/pages/TransactionsList';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard'); // Página padrão quando logado
  const [editingTransaction, setEditingTransaction] = useState(null); // Estado para edição
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = await AsyncStorage.getItem('@MyFinance:token');
      const storedUser = await AsyncStorage.getItem('@MyFinance:user');

      if (storedToken && storedUser) {
        try {
          api.defaults.headers.authorization = `Bearer ${storedToken}`;

          // --- ADICIONE ESTA LINHA DE TESTE ---
          // Fazemos uma chamada simples (pode ser a de saldo mesmo)
          await api.get('/transactions/balance');

          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Se der qualquer erro (401 ou Network Error de sessão morta)
          console.log("Sessão inválida no carregamento, deslogando...");
          logout(); // Limpa o storage e joga pro login
        }
      }

      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function logout() {
    await AsyncStorage.clear();
    setUser(null);
    setPage('dashboard');
  }

  // Função para centralizar o login
  function handleSignIn(userData) {
    setUser(userData);
    setPage('dashboard'); // Garante que ao logar ele vá para a home
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  // Se NÃO está logado
  if (!user) {
    return <Login onSignIn={handleSignIn} />;
  }

  // Se ESTÁ logado, o Switch de páginas:
  switch (page) {
    case 'profile':
      return <Profile user={user} onBack={() => setPage('dashboard')} />;
    case 'transaction':
      return (
        <Transaction
          transactionData={editingTransaction}
          onBack={() => {
            setEditingTransaction(null); // Limpa ao voltar
            setPage('dashboard');
          }}
        />
      );
    case 'transactionsList':
      return (
        <TransactionsList
          user={user}
          onEditTransaction={(transaction) => {
            setEditingTransaction(transaction);
            setPage('transaction');
          }}
          onBack={() => setPage('dashboard')}
        />
      );
    default:
      return (
        <Dashboard
          user={user}
          onLogout={logout}
          onProfile={() => setPage('profile')}
          onTransaction={() => setPage('transaction')}
          onTransactionsList={() => setPage('transactionsList')}
        />
      );
  }
}