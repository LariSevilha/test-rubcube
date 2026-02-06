markdown# 🌟 Backend API - Node.js

> Uma API REST moderna e elegante desenvolvida com Node.js, implementando as melhores práticas de desenvolvimento backend.

---

## ✨ O que é este projeto?

Esta é uma API completa que demonstra habilidades essenciais de desenvolvimento backend:

- 🔐 **Autenticação segura** com JWT
- 👥 **Gerenciamento de usuários** com controle de permissões
- 🌍 **Integração com API externa** (Rest Countries)
- 📊 **Sistema de logs** para auditoria
- ✅ **Testes automatizados** para garantir qualidade

---

## 🎯 Funcionalidades

### Para todos os usuários
- Criar conta e fazer login
- Buscar informações sobre países do mundo
- Filtrar países por região, moeda, idioma e população
- Gerenciar próprio perfil

### Para administradores
- Gerenciar todos os usuários
- Acessar logs completos do sistema
- Criar usuários diretamente

---

## 🚀 Começando

### Pré-requisitos
```bash
Node.js 18+ instalado
npm ou yarn
```

### Instalação rápida
```bash
# Clone o repositório
git clone 

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma migrate dev

# Inicie o servidor
npm run dev
```

🎉 Pronto! Sua API está rodando em `http://localhost:3000`

---

## 🔑 Guia de Uso

### 1️⃣ Crie sua conta
```bash
POST /auth/register
```
```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "senhaSegura123"
}
```

💡 **Dica:** O primeiro usuário automaticamente vira admin!

### 2️⃣ Faça login
```bash
POST /auth/login
```
```json
{
  "email": "maria@email.com",
  "password": "senhaSegura123"
}
```

Você receberá um **token**. Use-o em todas as próximas requisições:
```bash
Authorization: Bearer seu_token_aqui
```

### 3️⃣ Explore países
```bash
GET /countries?region=Americas&currency=USD&limit=10
```

**Filtros disponíveis:**
- `region` - África, Américas, Ásia, Europa, Oceania
- `currency` - USD, BRL, EUR...
- `language` - Portuguese, Spanish, English...
- `name` - Nome do país
- `minPopulation` / `maxPopulation` - Faixa de população
- `page` / `limit` - Paginação

---

## 📚 Endpoints Principais

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/register` | Criar nova conta |
| `POST` | `/auth/login` | Entrar na conta |

### Usuários
| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| `GET` | `/users` | Listar usuários | 🔐 Autenticado |
| `GET` | `/users/:id` | Ver perfil | 🔐 Próprio ou Admin |
| `POST` | `/users` | Criar usuário | 👑 Admin |
| `PATCH` | `/users/:id` | Editar perfil | 🔐 Próprio ou Admin |
| `DELETE` | `/users/:id` | Deletar conta | 🔐 Próprio ou Admin |

### Países
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/countries` | Buscar países com filtros |

### Logs (Admin apenas)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/logs` | Ver histórico de requisições |

---

## 🛠️ Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express |
| **Banco de Dados** | SQLite + Prisma ORM |
| **Autenticação** | JWT + bcrypt |
| **Testes** | Jest + Supertest |
| **API Externa** | Rest Countries |

---

## 🧪 Testes

Execute a suíte completa de testes:
```bash
npm test
```

---

## 📁 Estrutura do Projeto
```
📦 backend-api
├── 📂 src
│   ├── app.js              # Configuração do Express
│   ├── server.js           # Inicialização do servidor
│   ├── 📂 middlewares      # Auth e logs
│   ├── 📂 routes           # Rotas organizadas
│   └── 📂 services         # Lógica de negócio
├── 📂 prisma
│   ├── schema.prisma       # Modelo do banco
│   └── 📂 migrations       # Histórico de mudanças
└── 📂 tests                # Testes automatizados
```

---

## 💡 Destaques Técnicos

✅ **Segurança em primeiro lugar**
- Senhas criptografadas com bcrypt
- Autenticação JWT stateless
- Validação de permissões por role

✅ **Código limpo e organizado**
- Arquitetura modular
- Separação de responsabilidades
- Fácil manutenção e extensão

✅ **Auditoria completa**
- Logs automáticos de todas requisições
- Rastreabilidade de ações por usuário

---

## 🎨 Exemplos Práticos

### Buscar países da América do Sul que falam português
```bash
curl "http://localhost:3000/countries?region=Americas&language=Portuguese" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Ver seus próprios dados
```bash
curl http://localhost:3000/users/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Consultar logs (admin)
```bash
curl "http://localhost:3000/logs?method=GET&endpoint=/countries" \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

---

## 🚀 Próximos Passos

Ideias para evolução do projeto:

- [ ] Cache Redis para otimizar consultas externas
- [ ] Rate limiting para prevenir abuso
- [ ] Refresh tokens para sessões mais longas
- [ ] Deploy automatizado (Docker + Cloud)
- [ ] Documentação Swagger/OpenAPI
- [ ] Observabilidade com métricas e tracing

---

## 📄 Licença

Este projeto foi desenvolvido como teste técnico e está disponível para estudos.

---

<div align="center">

**Desenvolvido com ❤️ e ☕**

⭐ Se gostou do projeto, deixe uma estrela!

</div>