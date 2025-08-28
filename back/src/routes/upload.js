const express = require('express');
const router = express.Router();

module.exports = (upload, cloudinary) => {
    // POST - Upload de arquivo para o Cloudinary
    router.post('/', upload.single('file'), async (req, res) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }

            const result = await cloudinary.uploader.upload_stream(
                { folder: 'pets' },
                (error, uploadResult) => {
                    if (error) {
                        console.error('Erro ao fazer upload:', error);
                        return res.status(500).json({ error: 'Erro ao fazer upload.' });
                    }
                    res.status(200).json({ url: uploadResult.secure_url });
                }
            );

            result.end(file.buffer);
        } catch (error) {
            console.error('Erro ao fazer upload:', error.message);
            res.status(500).json({ error: 'Erro ao fazer upload.' });
        }
    });

    return router;
};
