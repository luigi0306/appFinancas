# appFinancas

Aplicativo mobile de finanças com Node.js e React Native (Expo).

## 🚀 Como Rodar o Projeto

### 1. Banco de Dados (Docker PostgreSQL)

1. Na raiz do projeto, rode:
   ```bash
   docker compose up -d
   ```
   - O PostgreSQL estará disponível em `localhost:5432`
   - Credenciais: usuário `postgres` / senha `postgres`

### 2. Backend (Node.js)

O servidor utiliza Express e Sequelize (PostgreSQL).

1.  Acesse a pasta: `cd backend`
2.  Instale as dependências: `npm install`
3.  Configure as variáveis de ambiente: O arquivo `.env` já vem configurado por padrão
4.  Inicie o servidor: `npm run dev`
    - O servidor rodará em `http://0.0.0.0:3000`.
    - O banco de dados será sincronizado e populado (seed) automaticamente ao iniciar.

### 2. Mobile (Expo)

O app mobile foi construído com Expo e utiliza navegação via estado local.

1.  Acesse a pasta: `cd mobile`
2.  Instale as dependências: `npm install`
3.  Inicie o Expo: `npx expo start`
4.  Escaneie o QR Code com o app **Expo Go** (Android/iOS) ou pressione `a` para Android / `i` para iOS se tiver um emulador.

---

_Nota: Certifique-se de que o backend está rodando para que o app consiga consumir os dados via API._
