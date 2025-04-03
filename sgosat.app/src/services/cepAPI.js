import { HTTPClient } from "./client";

const CepAPI = {
    async consultarAsync(cep) {
        try {
            const response = await HTTPClient.get(`/CEP/Consultar/${cep}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao consultar cep:", error);
            throw error;
        }
    }
}

export default CepAPI;