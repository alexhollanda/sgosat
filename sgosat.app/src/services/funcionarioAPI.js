import { HTTPClient } from "./client";

const FuncionarioAPI = {
    async obterAsync(funcionarioID) {
        try {
            const response = await HTTPClient.get(`/Funcionario/Obter/${funcionarioID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter Funcionário:", error);
            throw error;
        }
    },  
    async obterPorDocAsync(documento) {
        try {
            const response = await HTTPClient.get(`/Funcionario/ObterPorDoc/${documento}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter Funcionário:", error);
            throw error;
        }
    },
    async obterPorTermoAsync(query) {
        try {
            const response = await HTTPClient.get(`/Funcionario/ObterPorTermo?query=${query}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar funcionários:", error);
            throw error;
        }
    }, 
    async obterPaginadoAsync(pageNumber, pageSize, order, nome, documento) {
        try {
            const response = await HTTPClient.get(`/Funcionario/Paginar?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}&nome=${nome}&documento=${documento}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar funcionários:", error);
            throw error;
        }
    }, 
    async obterTecnicoAsync() {
        try {
            const response = await HTTPClient.get(`/Funcionario/ObterTecnico`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar funcionários:", error);
            throw error;
        }
    },    
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Funcionario/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar Funcionários:", error);
            throw error;
        }
    },   
    async listarTiposFuncionarios() {
        try {
            const response = await HTTPClient.get(`/Funcionario/ListarTiposFuncionarios`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar Tipos de Funcionários:", error);
            throw error;
        }
    },    
    async criarAsync(fucionarioCriar)
    {
        try {
            const response = await HTTPClient.post("/Funcionario/Criar", fucionarioCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar Funcionário:", error);
            throw error;
        }
    },
    async atualizarAsync(funcionarioAtualizar)
    {
        try {
            const response = await HTTPClient.put("/Funcionario/Atualizar", funcionarioAtualizar);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar Funcionário:", error);
            throw error;
        }
    },
    async deletarAsync(funcionarioID) {
        try {
            const response = await HTTPClient.delete(`/Funcionario/Deletar/${funcionarioID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar Funcionário:", error);
            throw error;
        }
    },
    async restaurarAsync(funcionarioID) {
        try {
            const response = await HTTPClient.put(`/Funcionario/Restaurar/${funcionarioID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar Funcionário:", error);
            throw error;
        }
    }   

}
export default FuncionarioAPI;