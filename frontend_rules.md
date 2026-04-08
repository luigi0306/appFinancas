# Diretrizes de Front-end para o Agente (Qwen 3.6 Pro)

Ao criar ou refatorar componentes visuais, obedeça estritamente a estas regras:

1. **Framework:** Use React Native + Expo. Navegação via estado local do React (componente App centraliza com `switch`/`if`), sem bibliotecas externas de roteamento como Expo Router ou React Navigation.
2. **Estilização:** Use o StyleSheet padrão do React Native. Mantenha um esquema de cores consistente focado em legibilidade. O tema geral da aplicação deve ser escuro _(Nota: NativeWind/Tailwind não está configurado no projeto)_
3. **Padrão Visual:** Siga o Material Design 3. Priorize clareza, fontes legíveis (sans-serif) e hierarquia visual clara para formulários e envios de dados.
4. **Estrutura:** Nenhum arquivo de componente deve ter mais de 150 linhas. Extraia lógicas complexas para Custom Hooks.
5. **Acessibilidade:** Suporte a leitores de tela e contraste adequado são inegociáveis.

ATENÇÃO: **REFERÊNCIAS** Quero uma estética clean e atual como a do Notion, ou do GPT-5.
