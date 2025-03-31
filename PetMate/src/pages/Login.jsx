import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import './Login.css';
import { useEffect } from 'react';
import Swal from 'sweetalert2'
import LoginOng from '../components/LoginOng';
import LoginUsuario from '../components/LoginUsuario';
import bcrypt from 'bcryptjs';

function Login() {
    const { Logar, mudarTipo, MostrarSenha, userLogado, setUserLogado } = useContext(GlobalContext);
    const [mudarConta, setMudarConta] = useState('1')
    const navigate = useNavigate()
    const [userData, setUserData] = useState(userLogado || {})
    const { } = useContext(GlobalContext);



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
                                    <input type="radio" name="radio" value='1' checked={mudarConta === '1'}
                                        onChange={(e) => setMudarConta(e.target.value)}></input>
                                    <span>Usuário</span>
                                </label>
                                <label>
                                    <input type="radio" name="radio" value='2' checked={mudarConta === '2'}
                                        onChange={(e) => setMudarConta(e.target.value)}></input>
                                    <span>Ong</span>
                                </label>
                            </div>
                        </div>

                        {mudarConta === '1' ? <LoginUsuario /> : <LoginOng />}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Login;