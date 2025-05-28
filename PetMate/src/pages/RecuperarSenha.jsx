import React, { useState } from 'react';
import './RecuperarSenha.css'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { enviarCodigoRecuperacao, verificarCodigoRecuperacao, redefinirSenha, getUserByEmail } from '../apiService';

function RecuperarSenha() {
    const [etapa, setEtapa] = useState(1);
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erros, setErros] = useState({})

    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (etapa === 1) {
                handleEnviarCodigo()
            } else if (etapa === 2) {
                handleVerificarCodigo()
            } else if (etapa === 3) {
                handleRedefinirSenha()
            }
        }
    };

    const handleEnviarCodigo = async () => {
        try {
            await enviarCodigoRecuperacao(email);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Código enviado para o e-mail!',
                showConfirmButton: false,
                timer: 1500,
            });
            setEtapa(2);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.response?.data?.message || 'Erro ao enviar o código.',
                confirmButtonColor: "#84644D",
            });
        }
    };

    const handleVerificarCodigo = async () => {
        try {
            await verificarCodigoRecuperacao(email, codigo);
            setEtapa(3);
        } catch (error) {
            Swal.fire({ 
                icon: 'error',
                title: 'Erro',
                text: error.response?.data?.message || 'Código inválido.',
                confirmButtonColor: "#84644D",
            });
        }
    };

    const handleRedefinirSenha = async () => {
        const erros = {};
        const user = await getUserByEmail(email)
        
        if(user.senha === novaSenha) {
            erros.novaSenha = 'A nova senha deve ser diferente da senha atual.'
        }
        if (!novaSenha) {
            erros.novaSenha = 'A nova senha é obrigatória.';
        } else if (novaSenha.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(novaSenha)) {
            erros.novaSenha = 'A senha deve ter pelo menos 8 caracteres e conter pelo menos um caractere especial.';
        }

        if (novaSenha !== confirmarSenha) {
            erros.confirmarSenha = 'As senhas não coincidem.';
        }

        if (Object.keys(erros).length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: erros.novaSenha || erros.confirmarSenha,
                confirmButtonColor: "#84644D",
            });
            return;
        }

        try {
            await redefinirSenha(email, novaSenha);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Senha redefinida com sucesso!',
                showConfirmButton: false,
                timer: 1500,
            });
            setEtapa(1);
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.response?.data?.message || 'Erro ao redefinir a senha.',
                confirmButtonColor: "#84644D",
            });
        }
    };

    return (
        <div className="recuperar-senha-page">
            {etapa === 1 && (
                <div className="etapa-1">
                    <h2>Recuperar Senha</h2>
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleEnviarCodigo}>Enviar Código</button>
                </div>
            )}

            {etapa === 2 && (
                <div className="etapa-2">
                    <h2>Verificar Código</h2>
                    <input
                        type="text"
                        placeholder="Digite o código recebido"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleVerificarCodigo}>Verificar Código</button>
                </div>
            )}

            {etapa === 3 && (
                <div className="etapa-3">
                    <h2>Redefinir Senha</h2>
                    <input
                        type="password"
                        placeholder="Nova senha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {erros.novaSenha && <p className="erro-input">{erros.novaSenha}</p>}
                    <input
                        type="password"
                        placeholder="Confirmar nova senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {erros.confirmarSenha && <p className="erro-input">{erros.confirmarSenha}</p>}
                    <button onClick={handleRedefinirSenha}>Redefinir Senha</button>
                </div>
            )}
        </div>
    );
}

export default RecuperarSenha;