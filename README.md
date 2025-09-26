# Barbearia do Dev - Sistema de Agendamento

**Status do Projeto: Concluído**

Este projeto é um Micro-SaaS (Software as a Service) full-stack para gestão de agendamentos em barbearias, construído com tecnologias modernas e foco em criar uma experiência de produto realista e profissional.

### Screenshots

| Página Inicial (Cliente) | Dashboard (Administrador) |
| :---: | :---: |
| ![Página Inicial](./assets/pagina-inicial.png) | ![Dashboard](./assets/dashboard.png) |

---

### Destaques para Recrutadores

Este projeto foi desenvolvido não apenas para ser funcional, mas para demonstrar competências técnicas e de produto em diversas áreas:

* **Arquitetura Full-Stack e Monorepo:** O código é organizado com backend e frontend desacoplados, uma prática comum em times de desenvolvimento modernos.
* **API RESTful Robusta:** O backend em Node.js/Express segue os princípios REST, com endpoints bem definidos para operações CRUD completas (Create, Read, Update, Delete) e lógica de negócio desacoplada em camadas (Rotas, Controladores, Serviços).
* **Gestão de Banco de Dados com ORM:** Utilização do **Prisma** para gerenciar o schema do banco de dados PostgreSQL, incluindo migrations para controle de versão e queries tipadas para garantir a segurança dos dados.
* **Frontend Moderno e Reativo:** Construído com **React** e **Vite** para uma experiência de desenvolvimento rápida e um resultado performático. Todo o código utiliza **TypeScript** para maior robustez.
* **UI/UX Profissional:** A interface foi construída com **Tailwind CSS** e **Shadcn/ui**, demonstrando habilidade com ferramentas de design system modernas para criar interfaces limpas, responsivas e reutilizáveis.
* **Componentização e Reusabilidade:** Componentes como o `AppointmentDialog` foram refatorados para serem utilizados tanto na criação quanto na edição de agendamentos, seguindo o princípio DRY (Don't Repeat Yourself).
* **Lógica de Negócio e Analytics:** O sistema vai além do CRUD básico, implementando regras de negócio como a verificação de horários disponíveis e a agregação de dados para analytics (gráfico de faturamento semanal).

---

### Tecnologias Utilizadas

#### **Backend**
* **Node.js** (Ambiente de execução)
* **TypeScript** (`v5.9.2`)
* **Express.js** (`v5.1.0`)
* **Prisma** (ORM) (`v6.16.2`)
* **PostgreSQL** (Banco de Dados, via Docker)
* **ts-node-dev** (`v2.0.0`)
* **date-fns** (`v4.1.0`)

#### **Frontend**
* **React** (`v19.1.1`)
* **Vite** (`v7.1.7`)
* **TypeScript** (`~v5.8.3`)
* **Tailwind CSS** (`v3.4.17`)
* **Shadcn/ui** (Biblioteca de Componentes)
* **React Router DOM** (`v7.9.2`)
* **Recharts** (`v3.2.1`)
* **Axios** (`v1.12.2`)
* **date-fns** (`v4.1.0`)
* **Lucide React** (Ícones) (`v0.544.0`)

---

### Como Executar o Projeto Localmente

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