import React, { useContext, useState } from 'react';
import './LoginOng.css';
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import Swal from 'sweetalert2';
import { loginOng } from '../apiService';

function LoginOng() {
    const { Logar } = useContext(GlobalContext);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
    const lastPage = localStorage.getItem('lastPage')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLoginOng();
        }
    };

    const handleLoginOng = async () => {
        try {
            const data = await loginOng(email, senha);
            if (data) {
                setErro('');
                Logar(data.user.email, data.user.senha, 'ong');
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Login realizado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500,
                });

                setTimeout(() => {
                    navigate(lastPage);
                }, 1500);

            } else {
                console.error('Erro no login:', data.error);
                setErro(data.error);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao fazer login. Tente novamente.';
            console.error('Erro no login:', errorMessage);

            setErro(errorMessage);
        }
    };

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    return (
        <div>
            <div className="titulo-input">
                <div className="inputs-login">
                    <div className="inpts-login">
                        <div className="inpt-p">
                            <div className="icon-input">
                                <FaEnvelope className="icon-login" />
                                <p>Email da ONG:</p>
                            </div>
                            <input
                                type="text"
                                placeholder="Digite seu email"
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
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={toggleMostrarSenha} className="icon-mostrar-senha">
                                    {mostrarSenha ? <FaRegEyeSlash /> : <FaRegEye />}
                                </button>
                            </div>
                            {erro && <p className="erro-mensagem-login">{erro}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="base-login">
                <button type="submit" onClick={handleLoginOng}>Login</button>
                <div className="container-recuperar-senha">
                    <Link to='/recuperar-senha'>Esqueci a senha</Link>
                </div>
                <div className="sem-cadastro">
                    <p>Ainda não se cadastrou? </p>
                    <Link to="/cadastro">Cadastre-se</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginOng;