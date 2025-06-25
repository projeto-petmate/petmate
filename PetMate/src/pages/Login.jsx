import React, { useState } from 'react';
import './Login.css';
import LoginOng from '../components/LoginOng';
import LoginUsuario from '../components/LoginUsuario';

function Login() {
    const [mudarConta, setMudarConta] = useState('1')

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
                        
                        <div className="mydict">
                            <div>
                                <label>
                                    <input type="radio" name="radio" value='1' checked={mudarConta === '1'}
                                        onChange={(e) => setMudarConta(e.target.value)}></input>
                                    <span>Usuário</span>
                                </label>
                                <label>
                                    <input type="radio" name="radio" value='2' checked={mudarConta === '2'}
                                        onChange={(e) => setMudarConta(e.target.value)}></input>
                                    <span>ONG</span>
                                </label>
                                
                            </div>
                            <p className='p-texto-login-desejado'>Selecione o login desejado</p>
                        </div>

                        {mudarConta === '1' ? <LoginUsuario /> : <LoginOng />}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Login;