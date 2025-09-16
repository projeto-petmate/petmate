import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import './LoginUsuario.css'
import { loginUser } from '../apiService';

function LoginUsuario() {
    const { Logar } = useContext(GlobalContext);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const lastPage = localStorage.getItem('lastPage')
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        try {
            const data = await loginUser(email, senha);
            if (data) {
                setErro('');
                Logar(data.user.email, data.user.senha, 'usuario');
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Login realizado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500,
                });

                let pagina
                if (lastPage) {
                    pagina = lastPage
                } else {
                    pagina = '/home'
                }
                localStorage.setItem('mostrarModalPromo', true)

                setTimeout(() => {
                    navigate(pagina);
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
                                <p className='texto-input-login'>Email:</p>
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
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder='Digite sua senha'
                                    id='inputSenha'
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={toggleMostrarSenha} className='icon-mostrar-senha'>
                                    {mostrarSenha ? <FaRegEyeSlash /> : <FaRegEye />}
                                </button>
                            </div>
                            {erro && <p className="erro-mensagem-login">{erro}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="base-login">
                <button type="submit" onClick={handleLogin}>Login</button>
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

export default LoginUsuario;