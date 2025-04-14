import React, { useContext } from 'react'
import './perfilOng.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CardPetPerfil from '../components/CardPetPerfil';
import { FiLogOut } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import ModalExclusaoDeConta from '../components/ModalExclusaoDeConta';
import ModalLogout from '../components/ModalLogout';
import Navbar from '../components/Navbar';
import { BsDoorOpenFill } from "react-icons/bs";

function PerfilOng() {
    const [editMode, setEditMode] = useState(false);
    const [openModalExclui, setOpenModalExclui] = useState(false);
    const { userLogado, PhoneInput, Logout, updateUsuario, deleteUsuario } = useContext(GlobalContext);
    const [userData, setUserData] = useState(userLogado || {});
    const [userPets, setUserPets] = useState([]);
    const [openModal, setOpenCadModal] = useState(false);
    const [openModalLogout, setOpenModalLogout] = useState(false);
    const [imagem, setImagem] = useState('');
    const [imagemPreviewPerfil, setImagemPreviewPerfil] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const storedSerOng = localStorage.getItem('vrfOng');

    const navigate = useNavigate();

    const handleLogout = () => {
        Logout();
        navigate('/home');
    };


  return (
    <div>
      <div className='conteiner-config-conta-ong'>
        <div className="texto-e-botao">
            <h2>Configurações de conta da ONG</h2>
            <img src="/images/barra_marrom.png" alt="" />
            <button className="botao-sair-logout" onClick={() => setOpenModalLogout(true)}>
                                <BsDoorOpenFill className='icon-logout' />
                       
             </button>
        </div>
        <p>Dados do Perfil</p>
        <div className="add-img">
            <input
                id="file-upload"
                type="file"
            />
        </div>
        <div className="inputs-infom-ong">
            <div className="colum-1">
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                <input 
                    type="text"
                    name="email"
                    // value={userData.email || ''}
                    disabled />
            </div>
                <label htmlFor="">CNPJ*</label>
            <div className="input-ongs-mostra-info">
                <input 
                    type="text"
                    name="email"
                    // value={userData.email || ''}
                    disabled />
            </div>
                <label htmlFor="">Nome da ONG:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">Telefone da ONG:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">Telefone para denúncias</label>
            <div className="input-ongs-mostra-info">
                 <input
                     type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
            </div>
            <div className='colum-2'>
                <label htmlFor="">Estado:</label>
            <div className="input-ongs-mostra-info">
                <input 
                     type="text"
                     name="nome"
                    //  value={userData.nome || ''}
                    //  onChange={handleChange}
                     disabled={!editMode}
                />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">Cidade:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">Endereço:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">Nome do responsável:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">Telefone do reponsável:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
            </div>
            <div className='colum-3'>
                <label htmlFor="">CPF:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">Data de nascimento:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail do reponsável</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">Senha:</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
            </div>
        </div>
            <div className="botoes">
            {!editMode ?
                        <button className='botao-editar-perfil' onClick={() => setEditMode(true)} >
                            <div className="editar-dados">
                                Editar Dados
                                <FaEdit className='icon-edit' />
                            </div>
                        </button>
                        : (
                        <button className="botao-salvar-perfil" onClick={handleSave}>
                                <div className="salvar-dados">
                                    Salvar Dados
                                    <FaCheck className='icon-edit' />
                                </div>
                        </button>
            )}
            </div>
            <ModalLogout isLogout={openModalLogout} setLogoutOpen={setOpenModalLogout} onLogout={handleLogout} />
      </div>
    </div>
  )
}

export default PerfilOng
