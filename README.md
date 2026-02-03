# 🐾 SoftPet - Sistema de Gerenciamento de Pets

Sistema completo de cadastro e gerenciamento de pets com autenticação, validação de formulários e interface moderna.

## 📋 Índice

- Sobre o Projeto
- Tecnologias
- Funcionalidades
- Arquitetura
- Instalação
  - Com Docker
  - Sem Docker
- O que faltou
- Próximos Passos

---

## 🎯 Sobre o Projeto
O **SoftPet** é uma aplicação full-stack desenvolvida para gerenciar cadastros de pets e seus donos. O projeto foi construído seguindo as melhores práticas de desenvolvimento, com foco em Clean Code, segurança, performance e experiência do usuário.

### ✨ Diferenciais
* **Autenticação JWT**: Sistema completo de login e registro com tokens seguros.
* **Docker Compose**: Infraestrutura containerizada para desenvolvimento e produção.
* **Mobile First**: Interface totalmente responsiva.
* **Validação Robusta**: Zod + React Hook Form para formulários type-safe.
* **UI Moderna**: Design system com TailwindCSS e componentes reutilizáveis.
* **Segurança**: Hash de senhas com bcrypt, CORS configurado e variáveis de ambiente.

---

## 🛠️ Tecnologias

### **Backend**
| Tecnologia | Descrição |
| :--- | :--- |
| **NestJS** | Framework Node.js progressivo para aplicações server-side |
| **TypeScript** | Superset JavaScript com tipagem estática |
| **Prisma** | ORM moderno para PostgreSQL |
| **PostgreSQL** | Banco de dados relacional |
| **JWT** | Autenticação stateless com JSON Web Tokens |
| **Bcrypt** | Hash de senhas com salt |
| **Class Validator** | Validação de DTOs |

### **Frontend**
| Tecnologia | Descrição |
| :--- | :--- |
| **React 18** | Biblioteca para construção de interfaces |
| **TypeScript** | Type-safety em todo o código |
| **Vite** | Build tool ultra-rápido |
| **TailwindCSS** | Framework CSS utility-first |
| **React Hook Form** | Gerenciamento performático de formulários |
| **Zod** | Schema validation TypeScript-first |
| **Context API** | Gerenciamento de estado global |

---

## ✨ Funcionalidades

### **Autenticação** ✅
- [x] Cadastro de usuários com validação de email e senha forte.
- [x] Login com JWT e Logout.
- [x] Proteção de rotas (`PrivateRoute`).
- [x] Persistência de sessão com `localStorage`.

### **Gerenciamento de Pets** ✅
- [x] Listagem de pets com paginação (12 itens por página).
- [x] Cadastro, Edição e Remoção de pets (CRUD).
- [x] Busca por nome do pet ou dono.
- [x] Filtros e ordenação.

### **Padrões de Projeto (Arquitetura)** 🏗️
- **MVC (Model-View-Controller)** no backend.
- **Component-Based Architecture** no frontend.
- **Repository Pattern** com Prisma.
- **DTO Pattern** para tráfego e validação de dados.

---

## 🚀 Instalação

### Pré-requisitos
* Node.js 18+
* Docker e Docker Compose (recomendado)
* Git

### 🐳 Com Docker (Recomendado)
```bash
# 1. Clonar o repositório
git clone [https://github.com/seu-usuario/softpet.git](https://github.com/seu-usuario/softpet.git)
cd softpet

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Buildar e subir os containers
docker-compose up -d --build

# 4. Acessar aplicação
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### 💻 Sem Docker
#### Backend

```Bash

# Acesse a pasta do backend
cd backend

# Instale as dependências do projeto
npm install

# Crie o arquivo .env a partir do exemplo
cp .env.example .env

# Edite o .env e configure corretamente:
# - DATABASE_URL
# - JWT_SECRET
# - PORT (opcional)
# - credenciais do banco
# Antes de continuar, certifique-se de que o banco de dados esteja rodando

# Executa as migrations no banco de dados
npx prisma migrate deploy

# Gera o Prisma Client
npx prisma generate

# Inicia a aplicação em modo produção
npm run start

```

#### Frontend
```Bash

# Acesse a pasta do frontend
cd frontend

# Instale as dependências do projeto
npm install

# Inicia o servidor de desenvolvimento do Vite
npm run dev

```

### O que faltou

- UI/UX: Ajustar design do Date Picker customizado.

- Feedback: Melhorar alertas de erro de login e usuário não encontrado.

### 🎯 Próximos Passos

- Vínculo Inteligente: Transformar input de dono em select com opção de novo cadastro.

- Segurança: Implementar fluxo de "Esqueci minha senha".

- Testes: Cobertura >80% com Jest e Testing Library.
