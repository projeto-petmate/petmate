import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';

function LoginUsuario() {
    const { Logar, mudarTipo, MostrarSenha, userLogado, setUserLogado } = useContext(GlobalContext);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login bem-sucedido:', data);
                setErro('');
                Logar(data.user.email, data.user.senha, 'usuario'); 
    
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Login realizado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500,
                });
    
                const lastPage = '/home';
                setTimeout(() => {
                    navigate(lastPage);
                }, 1500);
            } else {
                console.error('Erro no login:', data.error);
                setErro(data.error);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setErro('Erro na requisição');
        }
    };

    return (
        <div>
            <div className="titulo-input">
                <div className="inputs-login">
                    <div className="inpts-login">
                        <div className="inpt-p">
                            <div className="icon-input">
                                <FaEnvelope className="icon-login" />
                                <p>Email Usuário:</p>
                            </div>
                            <input
                                type="text"
                                placeholder='Digite seu email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="inpt-p">
                            <div className="icon-input">
                                <FaLock className="icon-login" />
                                <p>Senha:</p>
                            </div>
                            <div className="mostrar-senha">
                                <input
                                    type="password"
                                    placeholder='Digite sua senha'
                                    id='inputSenha'
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={MostrarSenha} className='icon-mostrar-senha'>
                                    {mudarTipo ? <FaRegEyeSlash /> : <FaRegEye />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {erro && <p className="erro-mensagem-login">{erro}</p>}
            </div>
            <div className="base-login">
                <button type="submit" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default LoginUsuario;