import { HTTPClient } from "./client";

const ClienteAPI = {
    async obterAsync(clienteID) {
        try {
            const response = await HTTPClient.get(`/Cliente/Obter/${clienteID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter Cliente:", error);
            throw error;
        }
    },  
    async obterPorDocAsync(documento) {
        try {
            const response = await HTTPClient.get(`/Cliente/ObterPorDoc/${documento}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter Cliente:", error);
            throw error;
        }
    },
    async obterPorTermoAsync(query) {
        try {
            const response = await HTTPClient.get(`/Cliente/ObterPorTermo?query=${query}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw error;
        }
    },   
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Cliente/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar pessoas:", error);
            throw error;
        }
    },    
    async criarAsync(nome, tipoPessoa, documento, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf)
    {
        try {
            const clienteCriar = {
                Nome: nome,
                TipoPessoa: tipoPessoa,
                Documento: documento,
                Telefone: telefone,
                CEP: cep,
                Logradouro: logradouro,
                Numero: numero,
                Complemento: complemento,
                Bairro: bairro,
                Cidade: cidade,
                UF: uf
            }
            const response = await HTTPClient.post("/Cliente/Criar", clienteCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar Cliente:", error);
            throw error;
        }
    },
    async atualizarAsync(clienteID, nome, telefone, cep, logradouro, numero, complemento, bairro, cidade, uf)
    {
        try {
            const clienteAtualizar = {
                ID: clienteID,
                Nome: nome,
                Telefone: telefone,
                CEP: cep,
                Logradouro: logradouro,
                Numero: numero,
                Complemento: complemento,
                Bairro: bairro,
                Cidade: cidade,
                UF: uf
            }
            const response = await HTTPClient.put("/Cliente/Atualizar", clienteAtualizar);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar Cliente:", error);
            throw error;
        }
    },
    async deletarAsync(clienteID) {
        try {
            const response = await HTTPClient.delete(`/Cliente/Deletar/${clienteID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar Cliente:", error);
            throw error;
        }
    },
    async restaurarAsync(clienteID) {
        try {
            const response = await HTTPClient.put(`/Cliente/Restaurar/${clienteID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar Cliente:", error);
            throw error;
        }
    }   

}
export default ClienteAPI;