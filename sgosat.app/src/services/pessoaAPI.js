import { HTTPClient } from "./client";

const PessoaAPI = {
    async obterAsync(pessoaID) {
        try {
            const response = await HTTPClient.get(`/Pessoa/Obter/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter pessoa:", error);
            throw error;
        }
    },
    async obterClienteAsync(pessoaID) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ObterCliente/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter cliente:", error);
            throw error;
        }
    },
    async obterFuncionarioAsync(pessoaID) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ObterFuncionario/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter funcionario:", error);
            throw error;
        }
    },
    async obterPorDocAsync(documento) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ObterPorDoc/${documento}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter pessoa:", error);
            throw error;
        }
    },
    async obterClientePorDocAsync(documento) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ObterClientePorDoc/${documento}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter cliente:", error);
            throw error;
        }
    },
    async obterFuncionarioPorDocAsync(documento) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ObterFuncionarioPorDoc/${documento}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter funcionário:", error);
            throw error;
        }
    },
    async obterPorEmailAsync(email) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ObterPorEmail/${email}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter pessoa:", error);
            throw error;
        }
    },
    async obterClientePorEmailAsync(email) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ObterClientePorEmail/${email}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter cliente:", error);
            throw error;
        }
    },
    async obterFuncionarioPorEmailAsync(email) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ObterFuncionarioPorEmail/${email}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter funcionário:", error);
            throw error;
        }
    },
    async obterPorTermoAsync(query) {
        try {
            const response = await HTTPClient.get(`Pessoa/ObterPorTermo?query=${query}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar pessoas:", error);
            throw error;
        }
    },   
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Pessoa/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar pessoas:", error);
            throw error;
        }
    },
    async listarClientesAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ListarClientes?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw error;
        }
    },
    async listarFuncionariosAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Pessoa/ListarFuncionarios?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar funcionários:", error);
            throw error;
        }
    },
    async listarTiposUsuarios(){
        try {
            const response = await HTTPClient.get(`/Usuario/ListarTiposUsuarios`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar tipos de usuários:", error);
            throw error;
        }
    },
    async criarAsync(nome, tipoPessoa, documento, telefone, email, cep, logradouro, numero,
                     complemento, bairro, cidade, uf, cliente, funcionario)
    {
        try {
            const pessoaCriar = {
                Nome: nome,
                TipoPessoa: tipoPessoa,
                Documento: documento,
                Telefone: telefone,
                Email: email,
                CEP: cep,
                Logradouro: logradouro,
                Numero: numero,
                Complemento: complemento,
                Bairro: bairro,
                Cidade: cidade,
                UF: uf,
                Cliente: cliente,
                Funcionario: funcionario
            }
            const response = await HTTPClient.post("/Pessoa/Criar", pessoaCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar pessoa:", error);
            throw error;
        }
    },
    async atualizarAsync(pessoaID, nome, telefone, email, cep, logradouro, numero,
        complemento, bairro, cidade, uf, cliente, funcionario)
    {
        try {
            const pessoaAtualizar = {
                ID: pessoaID,
                Nome: nome,
                Telefone: telefone,
                Email: email,
                CEP: cep,
                Logradouro: logradouro,
                Numero: numero,
                Complemento: complemento,
                Bairro: bairro,
                Cidade: cidade,
                UF: uf,
                Cliente: cliente,
                Funcionario: funcionario
            }
            const response = await HTTPClient.put("/Pessoa/Atualizar", pessoaAtualizar);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar pessoa:", error);
            throw error;
        }
    },
    async deletarAsync(pessoaID) {
        try {
            const response = await HTTPClient.delete(`/Pessoa/Deletar/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar pessoa:", error);
            throw error;
        }
    },
    async deletarClienteAsync(pessoaID) {
        try {
            const response = await HTTPClient.delete(`/Pessoa/DeletarCliente/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            throw error;
        }
    },
    async deletarFuncionarioAsync(pessoaID) {
        try {
            const response = await HTTPClient.delete(`/Pessoa/DeletarFuncionario/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar funcionário:", error);
            throw error;
        }
    },
    async restaurarAsync(pessoaID) {
        try {
            const response = await HTTPClient.put(`/Pessoa/Restaurar/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar pessoa:", error);
            throw error;
        }
    },
    async restaurarClienteAsync(pessoaID) {
        try {
            const response = await HTTPClient.put(`/Pessoa/RestaurarCliente/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar cliente:", error);
            throw error;
        }
    },
    async restaurarFuncionarioAsync(pessoaID) {
        try {
            const response = await HTTPClient.put(`/Pessoa/RestaurarFuncionario/${pessoaID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar funcionário:", error);
            throw error;
        }
    }

}

export default PessoaAPI;