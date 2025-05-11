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


# 📦 Entrega do Projeto Final – Curso Desenvolvedor Full Stack – Itera360
## 1️⃣ 🔗 Repositório GitHub
Link do repositório:
https://github.com/alexhollanda/sgosat

O repositório contém:

Todo o código-fonte da API desenvolvida com .NET Core 6.0 e C#

A aplicação frontend criada com React e React Bootstrap

Estrutura de projeto em camadas (Apresentação, Aplicação, Domínio, Repositório)

## 2️⃣ 📄 Documentação do Projeto

🏗️ Arquitetura do Projeto

A aplicação foi desenvolvida com uma arquitetura em camadas, que garante a separação de responsabilidades e facilita a manutenção:

•	Apresentação (sgosat/sgosat.api/sgosat.API): Interface API.
•	Aplicação (sgosat/sgosat.api/sgosat.Aplicacao): Contém a lógica de orquestração entre a camada de domínio e infraestrutura.
•	Domínio (sgosat/sgosat.api/sgosat.Dominio): Define entidades, interfaces e regras de negócio.
•	Infraestrutura (sgosat/sgosat.api/sgosat.Repositorio): Implementação dos repositórios e acesso ao banco de dados SQL Server.
•	Frontend (sgosat/sgosat.app): Interface em React, com integração à API via Axios e React Router.

A comunicação entre frontend e backend é feita via chamadas RESTful, utilizando JSON como formato padrão.


# ⚙️ Configuração e Execução do Projeto

Backend (.NET 6.0 + C#)

## 1️⃣ Clonar o repositório:
```bash
git clone https://github.com/alexhollanda/sgosat
```

## 2️⃣ Navegar até a pasta do backend e abrir com Visual Studio ou VS Code.

## 3️⃣ Restaurar pacotes:
```bash
dotnet restore
```

## 4️⃣ Configurar a appsettings.json com a string de conexão correta.

## 5️⃣ Rodar as migrations:
```bash
dotnet ef database update
```

## 6️⃣ No Banco de Dados, execute os seguintes Scripts SQL
```bash
INSERT INTO Funcionarios (
    Nome,
    Documento,
    DataNascimento,
    CPF,
    Salario,
    Ativo,
    TipoFuncionarioID
) VALUES (
    'ADMIN',
    '11111111111',
    '2000-01-01T00:00:00',
    '11111111111',
    0.00,
    1,
    2
);
```

```bash
INSERT INTO Usuarios (
    UserName,
    Email,
    Senha,
    Ativo,
    FuncionarioID,
    TipoUsuarioID
) VALUES (
    'admin',
    'ADMIN',
    '$2a$11$Mu.R7KPDFTt5u2g0eCLrUOaWiXvBTKmZbkUl2JFMWj8TXocIykote',
    1,
    1,
    1
);
```

```bash
CREATE PROCEDURE [dbo].[spObterClientesPaginados]
	@PageNumber INT,
	@PageSize INT,
	@Order INT,
	@Nome NVARCHAR(100) = NULL,
	@Documento NVARCHAR(20) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		Cliente.ID,
		Cliente.Nome,
		Cliente.Documento,
		Cliente.Telefone,
		COUNT(*) OVER() AS TotalRegistros
	FROM Cliente
	WHERE
		(@Nome IS NULL OR Cliente.Nome LIKE '%' + @Nome + '%') AND
		(@Documento IS NULL OR Cliente.Documento LIKE '%' + @Documento + '%') AND
		Cliente.Ativo = 1
	ORDER BY 
		CASE WHEN @Order = 1 THEN Cliente.ID END ASC,
		CASE WHEN @Order = 2 THEN Cliente.Nome END ASC
	OFFSET (@PageNumber - 1) * @PageSize ROWS
	FETCH NEXT @PageSize ROWS ONLY;
END
```

```bash
CREATE PROCEDURE [dbo].[spObterFuncionariosPaginados]
	@PageNumber INT,
	@PageSize INT,
	@Order INT,
	@Nome NVARCHAR(100) = NULL,
	@Documento NVARCHAR(20) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		Funcionario.ID,
		Funcionario.Nome,
		Funcionario.Documento,
		Funcionario.Telefone,
		COUNT(*) OVER() AS TotalRegistros
	FROM Funcionario
	WHERE
		(@Nome IS NULL OR Funcionario.Nome LIKE '%' + @Nome + '%') AND
		(@Documento IS NULL OR Funcionario.Documento LIKE '%' + @Documento + '%') AND
		Funcionario.ID <> 1 AND
		Funcionario.Ativo = 1
	ORDER BY 
		CASE WHEN @Order = 1 THEN Funcionario.ID END ASC,
		CASE WHEN @Order = 2 THEN Funcionario.Nome END ASC
	OFFSET (@PageNumber - 1) * @PageSize ROWS
	FETCH NEXT @PageSize ROWS ONLY;
END
```

```bash
CREATE PROCEDURE [dbo].[spObterOrdensPaginadas]
	@PageNumber INT,
	@PageSize INT,
	@Order INT,
	@Nome NVARCHAR(100) = NULL,
	@Status INT
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		OrdemServico.ID,
		OrdemServico.DataAbertura,
		Cliente.Nome,
		Cliente.Telefone,
		OrdemServico.StatusOSID,
		COUNT(*) OVER() AS TotalRegistros
	FROM OrdemServico
	INNER JOIN Cliente ON OrdemServico.ClienteID = Cliente.ID
	WHERE
		(@Nome IS NULL OR Cliente.Nome LIKE '%' + @Nome + '%') AND
		(@Status = 0 OR OrdemServico.StatusOSID = @Status) AND
		OrdemServico.Ativo = 1
	ORDER BY 
		CASE WHEN @Order = 1 THEN OrdemServico.ID END ASC,
		CASE WHEN @Order = 2 THEN Cliente.Nome END ASC,
		CASE WHEN @Order = 3 THEN OrdemServico.StatusOSID END ASC
	OFFSET (@PageNumber - 1) * @PageSize ROWS
	FETCH NEXT @PageSize ROWS ONLY;
END
```

```bash
CREATE PROCEDURE [dbo].[spObterUsuariosPaginados]
	@PageNumber INT,
	@PageSize INT,
	@Order INT,
	@Nome NVARCHAR(100) = NULL,
	@UserName NVARCHAR(20) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SELECT 
		Usuario.ID,
		Funcionario.Nome,
		Usuario.UserName,
		Usuario.Email,
		COUNT(*) OVER() AS TotalRegistros
	FROM Usuario
	INNER JOIN Funcionario ON Usuario.FuncionarioID = Funcionario.ID
	WHERE
		(@Nome IS NULL OR Funcionario.Nome LIKE '%' + @Nome + '%') AND
		(@UserName IS NULL OR Usuario.UserName LIKE '%' + @UserName + '%') AND
		Usuario.ID <> 1 AND
		Usuario.Ativo = 1
	ORDER BY 
		CASE WHEN @Order = 1 THEN Usuario.ID END ASC,
		CASE WHEN @Order = 2 THEN Funcionario.Nome END ASC
	OFFSET (@PageNumber - 1) * @PageSize ROWS
	FETCH NEXT @PageSize ROWS ONLY;
END
```

## 7️⃣ Executar a API:
```bash
dotnet run
```

# 🖥️ Frontend (React)

## 1️⃣ Navegar até a pasta do frontend:
```bash
cd sgosat/sgosat.app
```

## 2️⃣ Instalar dependências:
```bash
npm install
```

## 3️⃣ Rodar o projeto:
```bash
npm start
```

## 4️⃣ Para acessar o sistema (LOGIN):
Use as seguintes credenciais padrão já definidas:

•	Nome de usuário: admin

•	Senha: 12345

# 📄 Instruções de Uso
Exemplos de uso da API
## * Buscar cliente por documento:
```bash
GET /Cliente/ObterPorDoc/{doc}
```

## * Criar novo cliente:
```bash
POST /Cliente/Criar
```

# ⌨️ Interações no Frontend

## Login de Usuários

## Cadastro e busca de clientes

## Criação e acompanhamento de ordens de serviço com status

## Dashboard com resumo (em andamento, concluídas, etc.)

# 🧰 Dependências e Ferramentas

## Backend:

.NET 6.0

Entity Framework Core

SQL Server

BCrypt.Net-Next (criptografia de senhas)

## Frontend:

React 19.1.0

React Bootstrap

Axios

# 💡 Decisões Técnicas e Desafios

•	Optei por usar a arquitetura em camadas para melhor separação de responsabilidades.

•	Implementei autenticação com hash de senha (BCrypt).

•	Utilizei Stored Procedures com paginação no SQL Server para otimizar buscas.

•	Adicionei filtros, dashboard interativo e responsividade no frontend para melhorar a experiência do usuário.
