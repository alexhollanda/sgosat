import { HTTPClient } from "./client";

const UsuarioAPI = {
    async obterAsync(usuarioID) {
        try {
            const response = await HTTPClient.get(`/Usuario/Obter/${usuarioID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter usuário:", error);
            throw error;
        }
    },
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Usuario/Listar?ativos=${ativos}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
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
    async criarAsync(userName, senha, pessoa) {
        try {
            const usuarioCriar = {
                UserName: userName,
                Senha: senha,
                Pessoa: pessoa
            }
            const response = await HTTPClient.post("/Usuario/Criar", usuarioCriar);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    },
    async atualizarAsync(usuarioID, userName) {
        try {
            const usuarioAtualizar = {
                ID: usuarioID,
                UserName: userName
            }
            const response = await HTTPClient.put("/Usuario/Atualizar", usuarioAtualizar);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw error;
        }
    },
    async deletarAsync(usuarioID) {
        try {
            const response = await HTTPClient.delete(`/Usuario/Deletar/${usuarioID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            throw error;
        }
    },
    async restaurarAsync(usuarioID) {
        try {
            const response = await HTTPClient.put(`/Usuario/Restaurar/${usuarioID}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            throw error;
        }
    },
    async alterarSenhaAsync(usuarioID, senha, senhaAntiga) {
        try {
            const usuarioAlterarSenha = {
                ID: usuarioID,
                Senha: senha,
                SenhaAntiga: senhaAntiga
            }
            const response = await HTTPClient.put("/Usuario/AlterarSenha", usuarioAlterarSenha);
            return response.data;
            
        } catch (error) {
            console.error("Erro ao alterar senha do usuário:", error);
            throw error;            
        }
    }

}