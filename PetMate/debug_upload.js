// Teste de comparação entre upload de pet e upload de coleira

// Upload de PET (funcionando)
export const uploadPetImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
    }
};

// Upload de COLEIRA (com problema)
export const uploadColeiraScreenshot = async (base64String, filename = 'coleira-screenshot.png') => {
    try {
        // Converte base64 para blob
        const byteCharacters = atob(base64String.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        
        // Cria um arquivo a partir do blob
        const file = new File([blob], filename, { type: 'image/png' });
        
        // Faz upload usando a mesma função que upload de pet
        return await uploadPetImage(file);
    } catch (error) {
        console.error('Erro ao fazer upload do print da coleira:', error);
        throw error;
    }
};

// ANÁLISE:
// 1. O upload de pet recebe um File diretamente do input
// 2. O upload de coleira converte base64 → blob → File
// 3. Ambos usam a mesma função uploadPetImage no final
// 4. O problema pode estar na conversão base64 → File ou no tamanho do arquivo

// POSSÍVEIS PROBLEMAS:
// - Arquivo base64 muito grande
// - Erro na conversão base64 → blob
// - Timeout no servidor para arquivos grandes
// - Headers incorretos na requisição

// SOLUÇÕES A TESTAR:
// 1. Adicionar timeout maior na requisição
// 2. Verificar tamanho do arquivo gerado
// 3. Melhorar conversão base64 → File
// 4. Adicionar logs de debug
