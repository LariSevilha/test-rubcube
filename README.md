# 🚀 Backend Test API

API REST desenvolvida em Node.js com autenticação JWT, integração com API pública, filtros, paginação, logs e testes automatizados.

Este projeto foi construído com foco em **boas práticas**, **clareza**, **segurança** e **experiência do desenvolvedor (DX)**.

---

## 📦 Stack Utilizada

- **Node.js** + **Express**
- **Prisma ORM**
- **SQLite** (ambiente de desenvolvimento)
- **JWT** (jsonwebtoken)
- **Zod** (validação de dados)
- **Jest** + **Supertest** (testes)
- **Axios**
- **Helmet** + **CORS**
- **jq** + **curl** (DX / testes manuais)

---

## 🔗 Integração com API Pública

Este projeto integra com a **[Rest Countries API](https://restcountries.com/)**, consumindo dados de países e disponibilizando endpoints estruturados com:

- ✅ Normalização dos dados
- ✅ Filtros avançados
- ✅ Paginação
- ✅ Cache em memória (TTL)

> 🔒 Todos os endpoints de países são **protegidos por autenticação JWT**.

---

## 🔐 Autenticação (JWT)

### Funcionalidades

- ✅ Registro de usuário
- ✅ Login
- ✅ Proteção de rotas
- ✅ Controle de acesso por role (\`USER\` / \`ADMIN\`)
- ✅ Rate limit no login (proteção contra brute force)

### Endpoints

\`\`\`http
POST /auth/register
POST /auth/login
\`\`\`

### Exemplo de login

\`\`\`bash
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"teste@mail.com","password":"123456"}'
\`\`\`

**Resposta:**

\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

---

## 🌍 Countries (API Pública Integrada)

### Endpoints

\`\`\`http
GET /countries
GET /countries/:code
\`\`\`

### Filtros disponíveis

| Filtro          | Descrição                        |
|-----------------|----------------------------------|
| \`name\`          | Busca por nome do país           |
| \`region\`        | Filtrar por região               |
| \`currency\`      | Filtrar por moeda                |
| \`language\`      | Filtrar por idioma               |
| \`minPopulation\` | População mínima                 |
| \`maxPopulation\` | População máxima                 |

### Paginação

| Parâmetro | Descrição              |
|-----------|------------------------|
| \`page\`    | Número da página       |
| \`limit\`   | Itens por página       |

### Exemplo de uso

\`\`\`bash
curl -X GET "http://localhost:3000/countries?page=1&limit=5&region=Americas" \\
  -H "Authorization: Bearer SEU_TOKEN" | jq
\`\`\`

**Resposta:**

\`\`\`json
{
  "page": 1,
  "limit": 5,
  "total": 250,
  "items": [
    {
      "code": "BRA",
      "name": "Brazil",
      "region": "Americas",
      "population": 212559409
    }
  ]
}
\`\`\`

---

## 👥 Gerenciamento de Usuários

### Funcionalidades

- ✅ Criar usuário (ADMIN)
- ✅ Editar usuário (ADMIN ou próprio)
- ✅ Deletar usuário (ADMIN ou próprio)
- ✅ Listar um usuário
- ✅ Listar usuários com filtros e paginação

### Endpoint base

\`\`\`http
/users
\`\`\`

### Filtros (ADMIN)

- \`name\`
- \`email\`
- \`role\`

---

## 📜 Logs de Requisições

Todas as chamadas à API são registradas automaticamente.

### Informações registradas

- Usuário (se autenticado)
- Endpoint
- Método HTTP
- Status code
- IP
- User-Agent
- Tempo de resposta
- Data/hora

### Endpoint

\`\`\`http
GET /logs
\`\`\`

> 🔒 **Apenas ADMIN**

### Filtros disponíveis

- \`userId\`
- \`endpoint\`
- \`method\`
- \`from\` / \`to\` (data)
- \`page\` / \`limit\`

---

## ⚡ Cache (Performance)

- Cache em memória com **TTL de 15 minutos** para a API de países
- Evita chamadas repetidas à API pública
- Reduz latência e consumo externo

---

## 🧪 Testes Automatizados

- ✅ Testes de autenticação
- ✅ Testes de listagem de países
- ✅ Testes de controle de acesso
- ✅ Testes de logs
- ✅ Testes de usuários

### Rodar testes

\`\`\`bash
npm test
\`\`\`

---

## 🛠️ Comandos do Projeto

### Instalar dependências

\`\`\`bash
npm install
\`\`\`

### Rodar em desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

### Rodar em produção

\`\`\`bash
npm start
\`\`\`

---

## 🗄️ Prisma / Banco de Dados

### Gerar client

\`\`\`bash
npx prisma generate
\`\`\`

### Criar / atualizar banco (sem migrations)

\`\`\`bash
npx prisma db push
\`\`\`

### Abrir Prisma Studio

\`\`\`bash
npx prisma studio
\`\`\`

---

## 🔄 Resetar Banco de Dados (DEV)

### Script de reset

\`\`\`bash
node scripts/reset-db.js
\`\`\`

Ou via npm (se configurado):

\`\`\`bash
npm run db:reset
\`\`\`

**Esse script:**

- Limpa todas as tabelas
- Mantém o schema
- Ideal para testes locais

---

## 🧑‍💻 DX — cURL Legivel no Terminal

### Alias personalizado (\`curljson\`)

Adicione no \`~/.zshrc\` ou \`~/.bashrc\`:

\`\`\`bash
curljson() {
  local tmp
  tmp=$(mktemp)
  curl -sS -o "$tmp" \\
    -w "Status: %{http_code}\\nTime: %{time_total}s\\n" \\
    "$@"
  echo "-----------------------------"
  jq . "$tmp"
  rm -f "$tmp"
}
\`\`\`

Recarregue:

\`\`\`bash
source ~/.zshrc
\`\`\`

### Uso

\`\`\`bash
curljson "http://localhost:3000/health"
\`\`\`

Ou com autenticação:

\`\`\`bash
curljson "http://localhost:3000/countries?page=1&limit=2" \\
  -H "Authorization: Bearer SEU_TOKEN"
\`\`\`

---

## 🔐 Segurança Aplicada

- ✅ JWT com expiração
- ✅ Rate limit no login
- ✅ Validação de entrada com Zod
- ✅ Helmet + CORS
- ✅ Controle de acesso por role
- ✅ Logs auditáveis

---

## 🧠 Observações Finais

Este projeto foi desenvolvido com foco em:

- **Organização**
- **Escalabilidade**
- **Clareza de código**
- **Boas práticas reais de backend**
- **Entrega acima do mínimo solicitado no desafio**

---

## ✅ Checklist do Desafio

- [x] Integração com API pública
- [x] Autenticação JWT
- [x] Listagem com filtros e paginação
- [x] CRUD de usuários
- [x] Logs com filtros
- [x] Testes automatizados
- [x] README completo

---