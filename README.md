# Barbearia do Dev - Sistema de Agendamento

Este projeto é um Micro-SaaS (Software as a Service) completo para gestão de agendamentos em barbearias, construído com um stack de tecnologias modernas e foco em boas práticas de desenvolvimento.

## Visão Geral do Projeto

A aplicação permite que clientes visualizem os serviços oferecidos e agendem horários de forma intuitiva, enquanto fornece aos administradores (barbeiros) um dashboard para visualizar e gerenciar todos os agendamentos do dia.

## Tecnologias Utilizadas

Este projeto é um monorepo dividido em duas partes principais: `backend` e `frontend`.

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Linguagem:** TypeScript
* **Banco de Dados:** PostgreSQL (em Docker)
* **ORM:** Prisma (para interação segura e tipada com o banco de dados)
* **Gerenciador de Pacotes:** NPM

### **Frontend**
* **Framework:** React
* **Linguagem:** TypeScript
* **Build Tool:** Vite
* **Estilização:** Tailwind CSS (v3.0)
* **Biblioteca de Componentes:** Shadcn/ui
* **Roteamento:** React Router DOM
* **Cliente HTTP:** Axios

## Funcionalidades Implementadas

* **Listagem de Serviços:** A página inicial exibe os serviços oferecidos, buscando os dados dinamicamente da API.
* **Agendamento de Horários:** Clientes podem selecionar um serviço, escolher uma data e um horário disponível para agendar.
* **Dashboard Administrativo:** Uma página protegida (`/dashboard`) para o barbeiro visualizar todos os agendamentos de um dia específico em uma tabela organizada.
* **CRUD Completo de Agendamentos:** A API suporta a criação, leitura, atualização e exclusão de agendamentos.

## Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação na sua máquina.

### Pré-requisitos
* Node.js (versão 18 ou superior)
* NPM
* Docker (para o banco de dados PostgreSQL)

### 1. Clonar o Repositório
```bash
git clone https://github.com/andrebauzil/microSAAS-barbearia
cd barbearia-agendamentos
```

### 2. Configurar o Backend
```bash
# Navegue para a pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o container do banco de dados com Docker
docker run --name barbearia-db -e POSTGRES_USER=docker -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=barbearia -p 5432:5432 -d postgres

# Crie um arquivo .env na raiz do backend e adicione a string de conexão
echo "DATABASE_URL=\"postgresql://docker:docker@localhost:5432/barbearia?schema=public\"" > .env

# Rode as migrações do Prisma para criar as tabelas no banco
npx prisma migrate dev

# Inicie o servidor do backend
npm run dev
# O servidor estará rodando em http://localhost:3333
```

### 3. Configurar o Frontend
```bash
# Em um novo terminal, navegue para a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie a aplicação React
npm run dev
# A aplicação estará disponível em http://localhost:5173
```
Agora você pode acessar a aplicação no seu navegador!