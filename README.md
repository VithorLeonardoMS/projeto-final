# Curso API

API REST desenvolvida em Node.js com TypeScript para gerenciamento de cursos, com operações CRUD completas e persistência de dados em MySQL.

## Arquitetura do Projeto

O projeto segue uma arquitetura em camadas, utilizando separação de responsabilidades, com a seguinte estrutura:

src/
├── controllers/ # Responsáveis por receber requisições e enviar respostas
├── services/ # Implementa a lógica de negócio
├── repositories/ # Responsável pela comunicação com o banco de dados
├── models/ # Define as entidades e modelos de dados
├── interfaces/ # Contém definições de tipos e interfaces
├── database/ # Configuração do banco de dados e migrações
├── middlewares/ # Interceptadores de requisições
├── utils/ # Utilitários e helpers
├── app.ts # Inicialização e configuração do Express
├── routes.ts # Definição das rotas da API
└── server.ts # Ponto de entrada da aplicação

## Requisitos

- Node.js (v14 ou superior)
- MySQL (v5.7 ou superior)
- npm ou yarn

## Passo a Passo para Rodar a Aplicação Localmente

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd curso-api
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o MySQL
   Instale o MySQL de acordo com seu sistema operacional.

macOS:

```bash
$ brew install mysql
$ brew services start mysql
$ mysql_secure_installation
```

Windows:
Baixe e instale o MySQL Installer de https://dev.mysql.com/downloads/installer/

4.  Crie o banco de dados

Acesse o MySQL:

```bash
mysql -u root -p
```

Execute os seguintes comandos SQL:

```bash
CREATE DATABASE courses_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON courses_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

4. Execute a aplicação em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Configure as variáveis de ambiente
   Crie um arquivo .env na raiz do projeto:

   ```bash
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=comcourse
   NODE_ENV=development
   ```

6. Execute a aplicação

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

A API estará disponível em http://localhost:3000

## Endpoints Planejados

- `POST /cursos` - Criar um novo curso
- `GET /cursos/:id` - Obter um curso específico
- `GET /cursos` - Listar todos os cursos
- `PUT /cursos/:id` - Atualizar um curso
- `DELETE /cursos/:id` - Remover um curso
