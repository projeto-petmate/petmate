import React from 'react';
import './ModalLogout.css';
import { FiLogOut } from 'react-icons/fi';
import { IoCloseSharp } from 'react-icons/io5';

export default function ModalLogout({ isLogout, setLogoutOpen, onLogout }) {
    if (!isLogout) {
        return null;
    }

    return (
        <div>
            <div className='modal-logout'>
                <div className='container-modal-logout'>
                    <div className="meio-modal">
                        <FiLogOut className='icon-logout-modal'/>
                        <div className="texto_logout">
                            <h1>Tem certeza que deseja sair?</h1> 
                        </div>
                        <div className='botoes-logout'>
                            <button className='botao-cancelar-logout' onClick={() => setLogoutOpen(false)}>
                                <IoCloseSharp className='icon-btn-modal' />
                                Cancelar
                            </button>
                            <button className='botao-modal-logout' onClick={onLogout}>
                                <FiLogOut className='icon-btn-modal' />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}