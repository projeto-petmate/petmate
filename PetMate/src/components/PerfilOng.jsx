import React, { useContext } from 'react'
import './PerfilOng.css'
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
import { FaUserCircle } from "react-icons/fa";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { FaCheck, FaUnlock } from "react-icons/fa";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateUsuario(userData.id_ong, userData);
            setEditMode(false);
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 2000);
        } catch (error) {
            console.error('Erro ao atualizar usuário', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUsuario(userData.id_ong);
            handleLogout();
        } catch (error) {
            console.error('Erro ao deletar usuário', error);
        }
    };


    return (
        <div>
            <div className='conteiner-config-conta-ong'>
                <div className="texto-e-botao">
                    <div className="texto-e-img-barra">
                        <h2 className='config-conta-ong-titulo'>Configurações de conta da ONG</h2>
                        <img className='barra-marro-perfil-ong' src="/images/barra_marrom.png" alt="" />
                    </div>
                    <div className="botao-logout-ong">
                        <button className="botao-sair-logout" onClick={() => setOpenModalLogout(true)}>
                            <BsDoorOpenFill className='icon-logout' />
                        </button>
                    </div>
                </div>
                <p>Dados do Perfil</p>
                <div className="add-img">
                    {imagemPreviewPerfil === null ? (
                        <FaUserCircle
                            className="user-icon"
                            onClick={() => document.getElementById('file-upload').click()}
                        />
                    ) : (
                        <div
                            className="img-preview-perfil"
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            {imagemPreviewPerfil && (
                                <img
                                    src={imagemPreviewPerfil}
                                    alt="Pré-visualização"
                                    className="imagem-preview-perfil"
                                />
                            )}
                        </div>
                    )}
                    {editMode && <p className="trocar-foto-texto">
                        Clique no ícone para alterar sua imagem de perfil
                    </p>
                    }
                </div>
                <div className="inputs-infom-ong">
                    <div className="colum-1">
                        <label className='descricao-inputs' htmlFor="">E-mail da ONG*</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-1'
                                type="text"
                                name="email"
                                disabled />
                            <FaLock className='icon-cadeado-sem-edicao' />
                        </div>
                        <label className='descricao-inputs' htmlFor="">CNPJ*</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-2'
                                type="text"
                                name="email"
                                disabled />
                            <FaLock className='icon-cadeado-sem-edicao' />
                        </div>
                        <label className='descricao-inputs' htmlFor="">Nome da ONG:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-3'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">Telefone da ONG:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-4'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">Telefone para denúncias</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-5'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                    </div>
                    <div className='colum-2'>
                        <label className='descricao-inputs' htmlFor="">Estado:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-6'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">Cidade:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-7'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">Endereço:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-8'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">Nome do responsável:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-9'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">Telefone do reponsável:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-10'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                    </div>
                    <div className='colum-3'>
                        <label className='descricao-inputs' htmlFor="">CPF:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-12'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">Data de nascimento:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-12'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">E-mail do reponsável</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-13'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs' htmlFor="">Senha:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-14'
                                type="text"
                                name="nome"
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                             {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                            

                        </div>
                            <button className="botao-editar-descricao-ong">Editar Descrição do perfil</button>
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
                    {showSuccessPopup && (
                        <div className="success-popup-perfil">
                            <p>Dados salvos com sucesso!</p>
                        </div>
                    )}
                </div>
                <ModalExclusaoDeConta isExclui={openModalExclui} setContaExcluiOpen={() => setOpenModalExclui(!openModalExclui)} onDelete={handleDelete} />
                <ModalLogout isLogout={openModalLogout} setLogoutOpen={setOpenModalLogout} onLogout={handleLogout} />
            </div>
        </div>
    )
}

export default PerfilOng
