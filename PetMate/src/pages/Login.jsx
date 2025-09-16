import React, { useState } from 'react';
import './Login.css';
import LoginUsuario from '../components/LoginUsuario';

function Login() {

    return (
        <div>
            <div className="container-login">
                <div className="img-login">
                    <img src="./images/cachorro-login (1).png" className='img_cachorro' />
                </div>

                <div className="info-login">
                    <div className="titulo-input">
                        <div className="texto-login">
                            <h2>Login</h2>
                            <img src="/images/barra_marrom.png" className='barra_marrom' />
                            <p>Digite seus dados de acesso no campo abaixo.</p>
                        </div>
                        <LoginUsuario />
                        
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Login;