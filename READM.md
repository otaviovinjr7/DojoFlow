# 🥋 DojoFlow

**Gerenciador de aquecimentos para treinos de Jiu-Jitsu**

O DojoFlow é uma aplicação web desenvolvida para facilitar a organização e o acompanhamento dos aquecimentos antes dos treinos de Jiu-Jitsu. Com uma interface simples e intuitiva, permite cadastrar exercícios, montar rotinas personalizadas, controlar o tempo e consultar o histórico das sessões.

## ✨ Funcionalidades

- **Cadastro de exercícios:** registre exercícios com nome, categoria, duração e descrição.
- **Montagem de rotinas:** organize exercícios na sequência desejada.
- **Cálculo automático de duração:** confira o tempo total de cada rotina.
- **Cronômetro:** inicie, pause, retome e avance entre os exercícios.
- **Histórico de sessões:** consulte os aquecimentos concluídos.
- **Armazenamento local:** mantenha os dados salvos no navegador utilizando LocalStorage.
- **Interface responsiva:** organize os treinos em uma interface adaptável a diferentes tamanhos de tela.

## 🛠️ Tecnologias utilizadas

- HTML5 — estrutura da aplicação.
- CSS3 — estilos, layout e responsividade.
- JavaScript — funcionalidades e manipulação da interface.
- LocalStorage — persistência dos dados no navegador.
- Git e GitHub — versionamento e hospedagem do código.

## 🚀 Como executar o projeto

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto.
3. Abra o arquivo `index.html` no navegador.

Não é necessário instalar dependências ou configurar um banco de dados.

## 📁 Estrutura do projeto

```text
DojoFlow/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── storage.js
    ├── cronometro.js
    └── app.js
```

## 💾 Armazenamento de dados

O projeto utiliza o LocalStorage para salvar exercícios, rotinas e sessões no próprio navegador. Os dados não são sincronizados automaticamente entre dispositivos ou navegadores. Limpar os dados do navegador pode removê-los.

## 🧪 Testes realizados

- Cadastro de exercícios.
- Adição e ordenação de exercícios em rotinas.
- Cálculo do tempo total da rotina.
- Inicialização, pausa, retomada e avanço do cronômetro.
- Conclusão de uma rotina e registro no histórico.
- Persistência dos dados após atualizar a página.

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido como prática de desenvolvimento front-end, com foco em lógica de programação, manipulação do DOM, organização de código JavaScript e armazenamento local.

## 🔮 Melhorias futuras

- Exportação do histórico de treinos.
- Estatísticas de tempo de aquecimento.
- Edição e personalização avançada das rotinas.
- Melhorias de acessibilidade.
- Testes adicionais para situações inesperadas durante o cronômetro.

## 👨‍💻 Autor

Desenvolvido por **Otávio Rogério** como projeto de estudo em Desenvolvimento de Sistemas.

---

*DojoFlow — organize seu aquecimento, prepare seu treino e evolua no tatame.* 🥋
