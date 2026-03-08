# Explorador de Livros com Angular

## Descrição

Explorador de Livros é uma aplicação web moderna e responsiva para buscar, favoritar e organizar livros usando a Open Library API. Uma solução completa desenvolvida com Angular 19 e Tailwind CSS, oferecendo autenticação local e gerenciamento de favoritos.

## ✨ Funcionalidades

- **🔐 Autenticação Local**: Cadastro e login com armazenamento seguro no navegador (LocalStorage)
- **🔍 Busca de Livros**: Busca integrada com Open Library API por título, autor ou tema
- **❤️ Favoritar Livros**: Adiciona livros à lista de favoritos (apenas para usuários autenticados)
- **🏷️ Filtro de Favoritos**: Filtra livros favoritos por tag ou nome
- **✏️ Edição Completa**: Edita detalhes dos livros tanto na página inicial quanto na página de favoritos
- **📖 Informações Detalhadas**: Links diretos para ler, baixar PDF e comprar livros
- **🎭 Interface Moderna**: Design profissional com Tailwind CSS, gradientes, animações e efeitos glassmorphism
- **📱 Totalmente Responsivo**: Perfeito em desktop, tablet e smartphone

## 🚀 Instalação

Siga as instruções abaixo para configurar e rodar a aplicação localmente.

### Requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Angular CLI (opcional, mas recomendado)

### Passo a Passo

1. **Clone este repositório:**

   ```bash
   git clone https://github.com/Fernando32117/Busca-de-Livros.git
   cd Pesquisa-De-Livros-Angular
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Rode a aplicação:**

   ```bash
   npm start
   ```

   Ou com Angular CLI:

   ```bash
   ng serve
   ```

4. **Acesse no navegador:**

   Abra `http://localhost:4200`

**Pronto! 🎉** A aplicação está rodando e todos os dados serão armazenados localmente no navegador.

### Armazenamento de Dados

- **LocalStorage**: Todos os dados (usuários, favoritos, notas, tags, avaliações) são armazenados localmente no navegador
- **Segurança**: Os dados ficam isolados por domínio e apenas acessíveis no navegador do usuário
- **Persistência**: Os dados permanecem mesmo após fechar o navegador, até que o usuário limpe o cache

### APIs Externas

- **Open Library API**: Utilizada apenas para buscar informações sobre livros (capa, descrição, autores, etc.)

## 🧪 Testes Unitários

Para garantir a qualidade e robustez do código, foram implementados testes unitários usando Jasmine e Karma.

### Executando os Testes

```bash
npm test
```

Ou com Angular CLI:

```bash
ng test
```

Isso iniciará o Karma e executará todos os testes. Você verá uma saída detalhada indicando quais testes passaram.

### Cobertura dos Testes

Os testes unitários cobrem:

- ✅ **BookStorageService**: Adicionar, remover, atualizar e verificar favoritos
- ✅ **BookListComponent**: Exibição e interação dos livros, modal e favoritar
- ✅ **BookFavoritesComponent**: Exibição de favoritos, filtros e modal
- ✅ **AuthService & AuthGuard**: Autenticação, login, registro e proteção de rotas

## 🛠️ Tecnologias Utilizadas

- **Angular 19**: Framework principal com SSR (Server-Side Rendering)
- **TypeScript 5.5**: Linguagem de programação tipada
- **Tailwind CSS v3**: Framework CSS utility-first para design moderno
- **Open Library API**: API para buscar informações sobre livros
- **Firebase 11**: Autenticação (opcional/futuro)
- **LocalStorage**: Armazenamento local de dados no navegador
- **Jasmine & Karma**: Frameworks para testes unitários
- **HTML5 & CSS3**: Tecnologias padrão web

## 🗂️ Estrutura do Projeto

```
Pesquisa-De-Livros-Angular/
├── src/
│   ├── app/
│   │   ├── core/                    # Serviços e guards principais
│   │   │   ├── guards/              # AuthGuard para proteção de rotas
│   │   │   └── services/            # AuthService, BookStorageService, etc.
│   │   ├── features/                # Componentes de funcionalidades
│   │   │   ├── about/               # Página sobre o projeto
│   │   │   ├── auth/                # Login e registro
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── books/               # Funcionalidades de livros
│   │   │       ├── book-search/     # Busca de livros
│   │   │       ├── book-list/       # Listagem de resultados
│   │   │       └── book-favorites/  # Livros favoritos
│   │   ├── layout/                  # Layout e navegação
│   │   │   └── navigation/          # Navbar responsivo
│   │   └── shared/                  # Modelos e componentes compartilhados
│   │       └── models/              # Interfaces TypeScript
│   ├── styles.css                   # Estilos globais + Tailwind
│   └── index.html
├── tailwind.config.js               # Configuração do Tailwind
├── angular.json                     # Configuração do Angular
└── package.json
```

## 📝 Como Usar

1. **🆕 Criar Conta**: Clique em "Registrar", preencha seu nome, e-mail e senha
2. **🔑 Login**: Use seu e-mail e senha para acessar a aplicação
3. **🔍 Buscar Livros**: Digite o título, autor ou tema na barra de busca
4. **ℹ️ Visualizar Detalhes**: Clique no card do livro para ver informações completas
5. **❤️ Favoritar**: Clique no ícone de coração para salvar na sua biblioteca pessoal
6. **✏️ Gerenciar Favoritos**: Adicione notas, tags e avaliações aos seus livros
7. **🎯 Filtrar**: Use os filtros na página de favoritos para encontrar rapidamente

**💡 Dica**: Todos os seus dados ficam salvos localmente no navegador, mesmo depois de fechar a aplicação!

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** este repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um **Pull Request**

### Ideias para Contribuir

- 🌐 Implementar internacionalização (i18n)
- 🔐 Integrar autenticação real com Firebase
- 📱 Melhorar ainda mais a responsividade mobile
- 🎨 Adicionar temas (claro/escuro)
- 📊 Dashboard com estatísticas de leitura
- 🔔 Sistema de notificações
- 📚 Integrar mais APIs de livros (Open Library, etc.)

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais informações.

---

Feito com ❤️ por [Fernando Souza](https://www.linkedin.com/in/gerfernandosouza/)
