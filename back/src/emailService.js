require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

// Função para enviar e-mails
const enviarEmail = async (destinatario, assunto, mensagem) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: destinatario,
            subject: assunto,
            text: mensagem,
        };

        // Envia o e-mail
        await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado para ${destinatario}`);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
        
    }
};

module.exports = enviarEmail;