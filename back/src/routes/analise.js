const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = (upload, cloudinary) => {
    // POST - Análise de cores para pet
    router.post('/analise-cores-pet', upload.single('file'), async (req, res) => {
        console.log('📸 Requisição de análise de cores recebida');
        
        try {
            const file = req.file;

            if (!file) {
                console.log('❌ Nenhum arquivo enviado');
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }

            console.log('📁 Arquivo recebido:', file.originalname, 'Tamanho:', file.size);

            console.log('☁️ Fazendo upload para Cloudinary...');
            const cloudinaryResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'pets' },
                    (error, uploadResult) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(uploadResult);
                        }
                    }
                ).end(file.buffer);
            });

            console.log('✅ Upload para Cloudinary concluído:', cloudinaryResult.secure_url);

            console.log('🤖 Iniciando análise com Gemini...');
            
            if (!process.env.GEMINI_API_KEY) {
                console.error('❌ GEMINI_API_KEY não encontrada no arquivo .env');
                return res.status(500).json({ error: 'Chave da API Gemini não configurada.' });
            }
            
            console.log('🔑 Chave Gemini carregada:', process.env.GEMINI_API_KEY ? 'OK' : 'FALHA');
            
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `Analise a imagem do pet fornecida e sugira as melhores combinações de cores para uma coleira personalizada, considerando:

            1. A cor da pelagem, olhos e características físicas do pet
            2. A harmonia visual entre as cores do pet e da coleira
            3. Contraste adequado para boa visibilidade

            **Cores disponíveis para cada componente (todas sempre em estoque):**

            **Tecido da coleira:**
            - Preto
            - Branco  
            - Bege
            - Azul
            - Vermelho
            - Amarelo

            **Logo:**
            - Preto
            - Branco
            - Marrom

            **Argola:**
            - Dourado
            - Prata
            - Bronze

            **Presilha:**
            - Preto
            - Branco
            - Marrom
            - Azul
            - Vermelho
            - Amarelo

            **IMPORTANTE:** Todas as cores listadas estão sempre disponíveis. Escolha APENAS entre as cores especificadas para cada componente, sem mencionar disponibilidade ou alternativas de estoque.

            **Responda no formato:**

            🐕 **Análise do Pet:**
            [Descreva brevemente as cores e características do pet]

            🎨 **Combinação Recomendada:**
            - **Tecido:** [cor]
            - **Logo:** [cor]  
            - **Argola:** [cor]
            - **Presilha:** [cor]

            💡 **Alternativa 2:**
            - **Tecido:** [cor]
            - **Logo:** [cor]
            - **Argola:** [cor] 
            - **Presilha:** [cor]

            📝 **Explicação:**
            [Breve explicação do porquê essas combinações funcionam bem com este pet específico]`;

            const imageBase64 = file.buffer.toString('base64');
            
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: file.mimetype
                    }
                }
            ]);

            const response = result.response;
            const text = response.text();

            console.log('🎨 Análise concluída com sucesso');
            
            res.status(200).json({ 
                imageUrl: cloudinaryResult.secure_url,
                analysis: text
            });

        } catch (error) {
            console.error('❌ Erro na análise de cores:', error.message);
            res.status(500).json({ error: 'Erro na análise de cores.' });
        }
    });

    return router;
};
