import { HTTPClient } from "./client";

const OrdemServicoAPI = {
    async obterAsync(osID) {
        try {
            const response = await HTTPClient.get(`/OrdemServico/Obter/${osID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter Ordem de Serviço:", error);
            throw error;
        }
    },   
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/OrdemServico/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar Ordens de Serviço:", error);
            throw error;
        }
    },    
    async listarPorClienteAsync(clienteID, ativos) {
        try {
            const response = await HTTPClient.get(`/OrdemServico/ListarPorCliente/${clienteID}?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar Ordens de Serviço:", error);
            throw error;
        }
    },
    async listarPorFuncionarioAsync(funcionarioID, ativos) {
        try {
            const response = await HTTPClient.get(`/OrdemServico/ListarPorFuncionario/${funcionarioID}?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar Ordens de Serviço:", error);
            throw error;
        }
    },
    async listarPorStatusAsync(statusID, ativos) {
        try {
            const response = await HTTPClient.get(`/OrdemServico/ListarPorStatus/${statusID}?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar Ordens de Serviço:", error);
            throw error;
        }
    },
    async listarStatusOS() {
        try {
            const response = await HTTPClient.get(`/OrdemServico/ListarStatusOS`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar Status das Ordens de Serviço:", error);
            throw error;
        }
    },    
    async criarAsync(ordemServicoCriar)
    {
        try {
            const response = await HTTPClient.post("/OrdemServico/Criar", ordemServicoCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar Ordem de Serviço:", error);
            throw error;
        }
    },
    async atualizarAsync(ordemServicoAtualizar)
    {
        try {
            const response = await HTTPClient.put("/OrdemServico/Atualizar", ordemServicoAtualizar);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar Ordem de Serviço:", error);
            throw error;
        }
    },
    async deletarAsync(osID) {
        try {
            const response = await HTTPClient.delete(`/OrdemServico/Deletar/${osID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar Ordem de Serviço:", error);
            throw error;
        }
    },
    async restaurarAsync(osID) {
        try {
            const response = await HTTPClient.put(`/OrdemServico/Restaurar/${osID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao restaurar Ordem de Serviço:", error);
            throw error;
        }
    }   
}
export default OrdemServicoAPI;