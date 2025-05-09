# 🛠️ Sistema de Gerenciamento de Ordens de Serviço para Assistência Técnica (SGOSAT)

Este projeto é um sistema web para gerenciamento de ordens de serviço de uma empresa de assistência técnica especializada em portões eletrônicos, alarmes, câmeras e afins.

# Breve descrição do projeto
O sistema visa otimizar a gestão de ordens de serviço para empresas de assistência técnica em portões eletrônicos, alarmes e câmeras. Ele permite o cadastro de clientes e técnicos, registro e acompanhamento de ordens de serviço, e um dashboard para visualização geral do status das ordens.

# Motivação para a escolha do projeto

A falta de um sistema eficiente para gerenciamento de ordens de serviço resulta em atrasos, dificuldades no acompanhamento do trabalho e problemas na comunicação entre técnicos e administração. O projeto busca automatizar e organizar essas tarefas, proporcionando maior controle e eficiência na execução dos serviços.


## 🚀 Tecnologias Utilizadas

- **Linguagens de Programação:** C#, JavaScript
- **Fameworks e Bibliotecas:** .NET Core, React
- **Banco de Dados:** SQL Server
- **Ferramentas de Desenvolvimento:** GitHub (controle de versão), Visual Studio Code, Postman (testes de API), Webservice ViaCEP para consultas de CEP
- **Arquitetura:** Camadas (Apresentação, Aplicação, Domínio, Repositório e Serviços)

## 📌 Funcionalidades

- 📂 Cadastro de clientes (nome, endereço, contato) e técnicos (dados pessoais, especialidades).
- 📝 Registro e gerenciamento de ordens de serviço (descrição do problema, cliente, técnico responsável, status).
- 🔄 Controle de status das ordens (pendente, em andamento, concluído, cancelado).
- 📊 Dashboard com resumo das ordens.
- 📋 Formulário para cadastro de novas ordens.


## 💻 Plano de Desenvolvimento

1.	Definição e Modelagem do Banco de Dados
2.	Desenvolvimento da API em .NET Core
3.	Criação do Frontend com React
4.	Integração entre Frontend e Backend
5.	Desenvolvimento do Dashboard e Relatórios
6.	Testes e Validação do Sistema
7.	Implantação e Documentação Final


## ✅ Conclusão e Próximos Passos

O sistema oferecerá uma solução eficiente para o gerenciamento de ordens de serviço, melhorando a comunicação entre funcionários e clientes, além de otimizar a organização do trabalho. Futuras melhorias podem incluir:
•	Implementação de notificações automáticas para clientes e técnicos.
•	Aplicação mobile para facilitar o acesso ao sistema em campo.
•	Integração com sistemas de pagamento para facilitar cobranças.
Com esse planejamento, o desenvolvimento será estruturado e eficiente, garantindo um sistema funcional e de qualidade.


📦 Entrega do Projeto Final – Curso Desenvolvedor Full Stack – Itera360
1. 🔗 Repositório GitHub
Link do repositório:
https://github.com/alexhollanda/sgosat

O repositório contém:

Todo o código-fonte da API desenvolvida com .NET Core 6.0 e C#

A aplicação frontend criada com React e React Bootstrap

Estrutura de projeto em camadas (Apresentação, Aplicação, Domínio, Repositório)

2. 📄 Documentação do Projeto
🏗️ Arquitetura do Projeto
A aplicação foi desenvolvida com uma arquitetura em camadas, que garante a separação de responsabilidades e facilita a manutenção:

Apresentação (sgosat/sgosat.api/sgosat.API): Interface API.

Aplicação (sgosat/sgosat.api/sgosat.Aplicacao): Contém a lógica de orquestração entre a camada de domínio e infraestrutura.

Domínio (sgosat/sgosat.api/sgosat.Dominio): Define entidades, interfaces e regras de negócio.

Infraestrutura (sgosat/sgosat.api/sgosat.Repositorio): Implementação dos repositórios e acesso ao banco de dados SQL Server.

Frontend (sgosat/sgosat.app): Interface em React, com integração à API via Axios e React Router.

A comunicação entre frontend e backend é feita via chamadas RESTful, utilizando JSON como formato padrão.


⚙️ Configuração e Execução do Projeto

Backend (.NET 6.0 + C#)

1 - Clonar o repositório:
```bash
git clone https://github.com/alexhollanda/sgosat
```
2 - Navegar até a pasta do backend e abrir com Visual Studio ou VS Code.

3 - Restaurar pacotes:
```bash
dotnet restore
```
4 - Configurar a appsettings.json com a string de conexão correta.

5 - Rodar as migrations:
```bash
dotnet ef database update
```
6 - Executar a API:
```bash
dotnet run
```

Frontend (React)

1 - Navegar até a pasta do frontend:
```bash
cd sgosat/sgosat.app
```

2 - Instalar dependências:
```bash
npm install
```

3 - Rodar o projeto:
```bash
npm start
```

🧪 Instruções de Uso
Exemplos de uso da API
* Buscar cliente por documento:
```bash
GET /api/pessoas/documento/{doc}
```

* Criar novo cliente:
```bash
POST /api/pessoas
```

Interações no Frontend
Login de funcionários

Cadastro e busca de clientes

Criação e acompanhamento de ordens de serviço com status

Dashboard com resumo (em andamento, concluídas, etc.)

Filtros por técnico e por período

🧰 Dependências e Ferramentas
Backend:

.NET 6.0

Entity Framework Core

SQL Server

BCrypt.Net-Next (criptografia de senhas)

Frontend:

React 19.1.0

React Bootstrap

Formik + Yup (validação de formulários)

Axios

Recharts (gráficos no dashboard)

💡 Decisões Técnicas e Desafios
Optei por usar a arquitetura em camadas para melhor separação de responsabilidades.

Implementei autenticação com hash de senha (BCrypt).

Utilizei Stored Procedures com paginação no SQL Server para otimizar buscas.

Adicionei filtros, dashboard interativo e responsividade no frontend para melhorar a experiência do usuário.

O maior desafio foi alinhar os estados do React com os dados assíncronos da API, especialmente em formulários com preenchimento automático.
