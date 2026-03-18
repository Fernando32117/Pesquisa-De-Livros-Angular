# Explorador de Livros

Aplicação web para buscar, descobrir e favoritar livros, com autenticação real e persistência em nuvem.

**[🌐 Demo ao vivo](https://pesquisa-de-livros-angular.vercel.app)**

## ✨ Funcionalidades

- **🔐 Autenticação via Supabase**: Cadastro e login com sessão persistente gerenciada no servidor
- **🔍 Busca de Livros**: Pesquisa integrada com a Google Books API por título, autor ou tema, com paginação server-side (18 livros por página)
- **📖 Modal de Detalhes**: Visualização completa de cada livro — capa, descrição, autores, editora, links para ler, comprar e baixar PDF
- **🏠 Seção de Descoberta**: Recomendações curadas com filtros (Relevância, Mais lidos, Mais avaliados)
- **❤️ Favoritos na Nuvem**: Salva e remove livros dos favoritos — sincronizado com o banco de dados do usuário (acesso autenticado)
- **🏷️ Filtro de Favoritos**: Filtra a biblioteca pessoal por nome do livro ou tag
- **📄 Paginação**: Paginação server-side na busca e client-side nos favoritos (18 itens por página)
- **🔒 Proteção de Rotas**: AuthGuard aguarda o Supabase inicializar antes de liberar rotas protegidas
- **📱 Totalmente Responsivo**: Interface adaptada para desktop, tablet e smartphone

## 🛠️ Tecnologias

| Camada               | Tecnologia                              |
| -------------------- | --------------------------------------- |
| Framework            | Angular 19 (standalone components, SSR) |
| Linguagem            | TypeScript 5.5                          |
| Estilo               | Tailwind CSS v3                         |
| Autenticação & Banco | Supabase (Auth + PostgreSQL com RLS)    |
| API de Livros        | Google Books API (proxy server-side)    |
| Servidor SSR / Proxy | Express.js                              |
| Deploy               | Vercel                                  |
| Testes               | Jasmine & Karma                         |
| Ícones               | Font Awesome 6                          |
| Reatividade          | RxJS 7.8                                |

## 🚀 Instalação

### Requisitos

- Node.js v18 ou superior
- Uma conta no [Supabase](https://supabase.com) (gratuita)
- Uma chave da [Google Books API](https://developers.google.com/books) (gratuita)

### Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Fernando32117/Busca-de-Livros.git
   cd Pesquisa-De-Livros-Angular
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto:

   ```env
   GOOGLE_BOOKS_API_KEY=sua_chave_aqui
   ```

   As credenciais do Supabase ficam em `src/environments/environment.ts` (já configurado para o projeto).

4. **Rode a aplicação:**

   ```bash
   npm start
   ```

   O comando inicia o proxy da Google Books API (porta 3000) e o servidor de desenvolvimento Angular (porta 4200) simultaneamente.

5. **Acesse no navegador:**

   Abra `http://localhost:4200`

### Banco de Dados (Supabase)

Os scripts SQL para criar as tabelas estão na pasta `supabase/`:

- `001_create_book_favorites.sql` — tabela de favoritos com RLS
- `002_create_user_profiles.sql` — perfis de usuário com trigger automático

Execute-os no SQL Editor do painel do Supabase.

## 🧪 Testes

```bash
npm test
```

### Cobertura

- ✅ **AuthService**: Autenticação, sessão e estado do usuário
- ✅ **AuthGuard**: Proteção de rotas com inicialização do Supabase
- ✅ **BookStorageService**: Adicionar, remover e listar favoritos
- ✅ **BookSearchComponent**: Busca, paginação e estados de loading/erro

## 📝 Como Usar

1. **🆕 Criar Conta**: Clique em "Registrar" e preencha nome, e-mail e senha
2. **🔑 Login**: Entre com e-mail e senha para acessar sua conta
3. **🔍 Buscar Livros**: Digite título, autor ou tema na barra de busca
4. **📖 Ver Detalhes**: Clique em qualquer card para abrir o modal com informações completas
5. **❤️ Favoritar**: Adicione livros à sua biblioteca pessoal pelo modal de detalhes
6. **🎯 Explorar**: Use os filtros na seção de descoberta da página inicial
7. **📚 Gerenciar Favoritos**: Acesse "Favoritos" para ver, filtrar e remover livros salvos

## 🌐 Deploy

O projeto está configurado para deploy na **Vercel**. Configure a variável de ambiente `GOOGLE_BOOKS_API_KEY` no painel da Vercel antes do deploy.

```bash
vercel --prod
```

## 🤝 Contribuição

1. **Fork** este repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um **Pull Request**

### Ideias para Contribuir

- 🎨 Tema escuro (dark mode)
- 📊 Dashboard de leitura com estatísticas
- 🏷️ Sistema de tags e notas nos favoritos
- 🌐 Mais categorias de exploração (Romance, Fantasia, Negócios, etc.)
- ♿ Melhorias de acessibilidade (ARIA, navegação por teclado)
- 🔔 Notificações push

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

Feito com por [Fernando Souza](https://www.linkedin.com/in/gerfernandosouza/)
