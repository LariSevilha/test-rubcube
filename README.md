# Backend Test – Node.js API

API REST desenvolvida como parte de um teste técnico para a posição de desenvolvedor back-end.

O projeto demonstra integração com API externa, autenticação, persistência de dados, controle de acesso, logs de requisições e testes automatizados, seguindo boas práticas de desenvolvimento em Node.js.

---

## Visão Geral

Funcionalidades implementadas:
- Autenticação de usuários via JWT
- CRUD completo de usuários
- Integração com API pública (Rest Countries)
- Listagens com filtros e paginação
- Registro automático de logs de requisições
- Consulta de logs com filtros
- Testes automatizados

---

## Tecnologias Utilizadas

- Node.js
- Express
- Prisma ORM
- SQLite
- JSON Web Token (JWT)
- Axios
- bcrypt
- Jest
- Supertest
- dotenv
- Nodemon

---

## Arquitetura

Estrutura do projeto:

src/
├── app.js
├── server.js
├── prisma.js
├── middlewares/
├── routes/
└── services/

prisma/
├── schema.prisma
└── migrations/

src/tests/

yaml
Copy code

---

## API Pública Integrada

**Rest Countries API**  
https://restcountries.com/

A API permite listar países aplicando filtros por:
- Região
- Moeda
- Idioma
- Nome
- População mínima e máxima

---

## Autenticação

A autenticação é feita via JWT.

### Registrar usuário
curl -X POST http://localhost:3000/auth/register
-H "Content-Type: application/json"
-d '{"name":"Admin","email":"admin@mail.com","password":"123456"}'

markdown
Copy code

O primeiro usuário registrado recebe automaticamente o papel `ADMIN`.

### Login
curl -X POST http://localhost:3000/auth/login
-H "Content-Type: application/json"
-d '{"email":"admin@mail.com","password":"123456"}'

css
Copy code

A resposta retorna um token JWT:

{ "token": "..." }

yaml
Copy code

Esse token deve ser enviado no header `Authorization` para acessar rotas protegidas.

---

## Gerenciamento de Usuários

### Listar usuários (com paginação e filtros)
curl "http://localhost:3000/users?page=1&limit=10&name=ad"
-H "Authorization: Bearer <TOKEN>"

shell
Copy code

### Buscar usuário por ID
curl http://localhost:3000/users/<USER_ID>
-H "Authorization: Bearer <TOKEN>"

shell
Copy code

### Criar usuário (ADMIN)
curl -X POST http://localhost:3000/users
-H "Authorization: Bearer <TOKEN>"
-H "Content-Type: application/json"
-d '{"name":"User","email":"user@mail.com","password":"123456"}'

shell
Copy code

### Atualizar usuário
curl -X PATCH http://localhost:3000/users/<USER_ID>
-H "Authorization: Bearer <TOKEN>"
-H "Content-Type: application/json"
-d '{"name":"User atualizado"}'

shell
Copy code

### Remover usuário
curl -X DELETE http://localhost:3000/users/<USER_ID>
-H "Authorization: Bearer <TOKEN>"

yaml
Copy code

---

## Countries – Filtros e Paginação

### Listar países
curl "http://localhost:3000/countries?region=Americas&currency=BRL&page=1&limit=5"
-H "Authorization: Bearer <TOKEN>"

shell
Copy code

### Buscar país por código
curl http://localhost:3000/countries/BR
-H "Authorization: Bearer <TOKEN>"

yaml
Copy code

---

## Logs de Requisições (ADMIN)

### Consultar logs
curl "http://localhost:3000/logs?page=1&limit=10&endpoint=/countries&method=GET"
-H "Authorization: Bearer <TOKEN>"

yaml
Copy code

---

## Como Executar o Projeto

### Pré-requisitos
- Node.js v18 ou superior
- npm

### Instalação
npm install

bash
Copy code

### Configuração do ambiente
Crie um arquivo `.env` na raiz do projeto:
PORT=3000
JWT_SECRET=super_secret_change_me
DATABASE_URL=file:./dev.db

shell
Copy code

### Criar banco de dados
npx prisma migrate dev

shell
Copy code

### Executar a aplicação
npm run dev

css
Copy code

A API estará disponível em:
http://localhost:3000

yaml
Copy code

---

## Testes Automatizados

Para executar os testes:
npm test

yaml
Copy code

---

## Decisões Técnicas

- SQLite para facilitar a execução local
- Prisma ORM para organização e segurança
- JWT para autenticação stateless
- Arquitetura modular visando manutenção e escalabilidade
- Logs automáticos para auditoria

---

## Considerações Finais

Projeto desenvolvido com foco em clareza, simplicidade e boas práticas de desenvolvimento back-end.