# Explorador de Livros com Angular

## Descrição

Explorador de Livros é uma aplicação web para buscar, favoritar e organizar livros usando a Google Books API. Agora, os usuários podem criar contas, fazer login e gerenciar seus favoritos de forma personalizada.

## Funcionalidades

- **Autenticação de Usuário**: Cadastro e login seguro com senha criptografada.
- **Busca de Livros**: Permite a busca de livros pela Google Books API.
- **Favoritar Livros**: Adiciona livros à lista de favoritos (apenas para usuários autenticados).
- **Filtro de Favoritos**: Filtra livros favoritos por tag ou nome.
- **Notas Pessoais**: Adiciona notas pessoais aos livros favoritos.
- **Avaliações**: Avalia os livros com uma nota de 1 a 5.
- **Tags**: Adiciona tags aos livros favoritos.
- **Edição de Informações**: Usuários podem editar detalhes dos livros tanto na página INICIAL quanto na página de FAVORITOS.
- **Informações Detalhadas**: Exibe informações detalhadas sobre os livros, incluindo links para LER, BAIXAR PDF e COMPRAR.
- **Interface Moderna**: Interface de usuário com efeitos visuais modernos, incluindo animações e gradientes.

## Instalação

Siga as instruções abaixo para configurar e rodar a aplicação localmente.

### Backend (Node.js + PostgreSQL)

#### Requisitos:
- Docker e Docker Compose
- Node.js e npm

1. Clone este repositório:
    ```bash
    git clone https://github.com/Fernando32117/Busca-de-Livros.git
    cd Pesquisa-De-Livros
    ```

2. Instale as dependências do backend:
    ```bash
    cd backend
    npm install
    ```

3. Suba os containers do banco de dados e backend:
    ```bash
    docker-compose up -d --build
    ```

O backend rodará na porta `3000`.

### Frontend (Angular)

#### Requisitos:
- Angular CLI

1. Volte para a pasta raiz do projeto e instale as dependências:
    ```bash
    cd frontend
    npm install
    ```

2. Rode a aplicação:
    ```bash
    ng serve
    ```

3. Abra o navegador e acesse `http://localhost:4200`.

## Testes Unitários

Para garantir a qualidade e robustez do código, foram implementados testes unitários usando Jasmine e Karma.

### Executando os Testes

1. Para executar os testes unitários, use o seguinte comando:
    ```bash
    ng test
    ```

2. Isso iniciará o Karma e executará todos os testes configurados. Você verá uma saída detalhada indicando quais testes passaram e quais falharam.

### Cobertura dos Testes

Os testes unitários cobrem as seguintes funcionalidades:

- **BookStorageService**: Adicionar, remover, atualizar e verificar favoritos.
- **BookListComponent**: Exibição e interação dos livros, abertura e fechamento do modal, e funcionalidade de favoritar.
- **BookFavoritesComponent**: Exibição de favoritos, filtro de livros por tag ou nome, e interação com o modal.
- **Autenticação**: Testes para login e cadastro de usuários.

## Tecnologias Utilizadas

- **Angular**: Framework para desenvolvimento da aplicação web.
- **Node.js + Express**: Backend responsável pela autenticação e gerenciamento de favoritos.
- **PostgreSQL**: Banco de dados para armazenar usuários e favoritos.
- **Sequelize**: ORM para interação com o banco de dados PostgreSQL.
- **Google Books API**: API utilizada para buscar informações sobre os livros.
- **Bcrypt.js**: Utilizado para criptografar senhas de usuários.
- **Jasmine e Karma**: Frameworks de testes unitários.
- **HTML5 e CSS3**: Tecnologias padrão para estruturação e estilização da aplicação.

## Uso

1. **Criar Conta**: Clique em "Registrar", preencha os dados e cadastre-se.
2. **Login**: Use seu e-mail e senha para acessar a aplicação.
3. **Buscar Livros**: Digite o título ou autor na barra de busca.
4. **Visualizar Detalhes**: Clique no botão "Info" para ver mais detalhes.
5. **Favoritar**: Clique no botão de favoritar para salvar o livro (somente disponível para usuários logados).
6. **Gerenciar Favoritos**: Edite notas, tags e avaliações dos seus livros favoritos.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais informações.

---

Feito com ❤️ por [Fernando Souza](https://www.linkedin.com/in/gerfernandosouza/)

