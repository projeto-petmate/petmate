import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import './Login.css';
import { useEffect } from 'react';
import Swal from 'sweetalert2'

function Login() {
    const { Logar, mudarTipo, MostrarSenha, userLogado, setUserLogado } = useContext(GlobalContext);
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const navigate = useNavigate()
    const [userData, setUserData] = useState(userLogado || {})
    const { } = useContext(GlobalContext);


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

                localStorage.setItem("logado", JSON.stringify(true));
                localStorage.setItem("userLogado", JSON.stringify(data.user));

                const lastPage = localStorage.getItem('lastPage') || '/home';
                Swal.fire({
                    position: "mid",
                    icon: "success",
                    title: "Login realizado com sucesso!",
                    showConfirmButton: false,
                    timer: 1500
                  });
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


    useEffect(() => {
        if (!userLogado) {
            const storedUser = JSON.parse(localStorage.getItem('userLogado'));
            if (storedUser) {
                setUserLogado(storedUser);
                setUserData(storedUser);
            }
        }
    }, [userLogado, setUserLogado]);

    return (
        <div>
            <div className="container-login">
                <div className="img-login">
                    {/* <h2 className="titulo-bem-vindo">Bem-vindo de volta!</h2> */}
                    <img src="./images/cachorro-login (1).png" className='img_cachorro' />
                </div>
                <div className="info-login">
                    <div className="titulo-input">
                        <div className="texto-login">
                            <h2>Login</h2>
                            <img src="/images/barra_marrom.png" className='barra_marrom' />
                            <p>Digite seus dados de acesso no campo abaixo.</p>
                        </div>

                        <div class="mydict">
	                        <div>
		                        <label>
			                        <input type="radio" name="radio" value='1'></input>
			                        <span>Usuário</span>
		                        </label>
		                        <label>
			                        <input type="radio" name="radio" value='2'></input>
			                        <span>Ong</span>
		                        </label>
		
	                        </div>
                        </div>
                        
                        <div className="inputs-login">
                            <div className="inpts-login">
                                <div className="inpt-p">
                                    <div className="icon-input">
                                        <FaEnvelope className="icon-login" />
                                        <p>Email:</p>
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
                        <button type='submit' onClick={handleLogin}>Login</button>
                        <div className="sem-cadastro">
                            <p>Ainda não se cadastrou? </p>
                            <Link to="/cadastro">Cadastre-se</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;