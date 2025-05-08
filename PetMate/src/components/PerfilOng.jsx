import React, { useContext, useEffect } from 'react'
import './PerfilOng.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CardPetPerfil from '../components/CardPetPerfil';
import { FiLogOut } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import ModalExclusaoDeConta from '../components/ModalExclusaoDeConta';
import ModalLogout from '../components/ModalLogout';
import Navbar from '../components/Navbar';
import { BsDoorOpenFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { FaCheck, FaUnlock } from "react-icons/fa";
import { deleteOng, updateOng } from '../apiService';
import { TbMoodEdit } from 'react-icons/tb';
import ModalConfirmFoto from './ModalConfirmFoto';

function PerfilOng() {
    const [editMode, setEditMode] = useState(false);
    const [openModalExclui, setOpenModalExclui] = useState(false);
    const { userLogado, PhoneInput, Logout, updateUsuario, deleteUsuario } = useContext(GlobalContext);
    const [userData, setUserData] = useState(null);
    const [userPets, setUserPets] = useState([]);
    const [openModal, setOpenCadModal] = useState(false);
    const [openModalLogout, setOpenModalLogout] = useState(false);
    const [imagem, setImagem] = useState('');
    const [imagemPreviewPerfil, setImagemPreviewPerfil] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    
    const navigate = useNavigate();

    const handleLogout = () => {
        Logout();
        navigate('/home');
    };


    useEffect(() => {
        if (userLogado) {
            setUserData(userLogado);
        }
    }, [userLogado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        if (userLogado) {
            setUserData(userLogado);
            setImagemPreviewPerfil(userLogado?.foto_perfil || null);
        }
    }, [userLogado]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagemPreviewPerfil(reader.result);
            setUserData((prevData) => ({ ...prevData, foto_perfil: reader.result }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setImagemPreviewPerfil(null);
        setUserData((prevData) => ({ ...prevData, foto_perfil: null }));
        document.getElementById('file-upload').value = null;
        setIsModalConfirmOpen(false);
    };
    const handleSave = async () => {
        try {
            if (!userData.id_ong) {
                console.error("Erro: ID da ONG não definido.");
                return;
            }

            await updateOng(userData.id_ong, userData);
            setEditMode(false);
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 2000);
        } catch (error) {
            console.error("Erro ao atualizar dados da ONG:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOng(userData.id_ong);
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
                <div className="user-icon-container">
                    <div className="add-img">
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            disabled={!editMode}
                        />
                    </div>
                    {imagemPreviewPerfil || userData?.foto_perfil ? (
                        <div
                            className="img-preview-perfil"
                            onClick={() => editMode && document.getElementById('file-upload').click()}
                        >
                            <img
                                src={imagemPreviewPerfil || userData?.foto_perfil}
                                alt="Pré-visualização"
                                className="imagem-preview-perfil"
                            />
                        </div>
                    ) : (
                        <TbMoodEdit
                            className="user-icon-perfil"
                            onClick={() => editMode && document.getElementById('file-upload').click()}
                        />
                    )}
                    <div className="icon-trash-container">
                        {(imagemPreviewPerfil || userData?.foto_perfil) && (
                            <FaTrash
                                className="icon-trash"
                                onClick={() => setIsModalConfirmOpen(true)}
                                style={{ cursor: editMode ? 'pointer' : 'not-allowed', opacity: editMode ? 1 : 0.5 }}
                            />
                        )}
                    </div>
                    {editMode && <p className="trocar-foto-texto">Clique no ícone para alterar sua imagem de perfil</p>}

                </div>
                <div className="inputs-infom-ong">
                    <div className="colum-1">
                        <label className='descricao-inputs'>E-mail da Conta*</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-1'
                                type="text"
                                name="email"
                                value={userData?.email || ''}
                                disabled
                            />
                            <FaLock className='icon-cadeado-sem-edicao' />
                        </div>
                        <label className='descricao-inputs'>CNPJ*</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-2'
                                type="text"
                                name="cnpj"
                                value={userData?.cnpj || ''}
                                disabled
                            />
                            <FaLock className='icon-cadeado-sem-edicao' />
                        </div>
                        <label className='descricao-inputs'>Senha:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-14'
                                type="password"
                                name="senha"
                                value={userData?.senha || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Nome da ONG:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-3'
                                type="text"
                                name="nome_ong"
                                value={userData?.nome_ong || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Instragram da ONG (opcional)</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-13'
                                type="text"
                                name="instagram"
                                value={userData?.instagram || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>

                    </div>
                    <div className='colum-2'>
                        <label className='descricao-inputs'>Telefone da ONG:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-4'
                                type="text"
                                name="telefone"
                                value={userData?.telefone || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Email de Contato ONG:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-5'
                                type="text"
                                name="telefone_denuncia"
                                value={userData?.email_contato || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Estado:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-6'
                                type="text"
                                name="estado_ong"
                                value={userData?.estado || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Cidade:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-7'
                                type="text"
                                name="cidade_ong"
                                value={userData?.cidade || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Endereço:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-8'
                                type="text"
                                name="endereco_ong"
                                value={userData?.endereco || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>

                    </div>
                    <div className='colum-3'>
                        <label className='descricao-inputs'>Nome do responsável:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-9'
                                type="text"
                                name="nome_responsavel"
                                value={userData?.nome_responsavel || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Telefone do responsável:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-10'
                                type="text"
                                name="telefone_responsavel"
                                value={userData?.telefone_responsavel || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>CPF do responsável:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-12'
                                type="text"
                                name="cpf_responsavel"
                                value={userData?.cpf_responsavel || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Data de nascimento:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-12'
                                type="text"
                                name="data_nascimento_responsavel"
                                value={userData?.data_nascimento_responsavel || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Descrição:</label>
                        <div className="input-ongs-mostra-info">
                            <input
                                className='input-14'
                                id='desc-ong-perfil'
                                type="text"
                                name="descricao"
                                value={userData?.descricao || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ?
                                <FaLock className='icon-cadeado' /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                    </div>

                </div>
                <div className="botoes">
                    <div className="botoes-perfil-ong">
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
                        <button className="botao-perfil-excluir-ong" onClick={() => setOpenModalExclui(true)}>Excluir conta permanentemente</button>
                        {/* <h4>Excluir conta permanentemente</h4> */}
                    </div>
                    <ModalExclusaoDeConta
                        isExclui={openModalExclui}
                        setContaExcluiOpen={() => setOpenModalExclui(!openModalExclui)}
                        onDelete={handleDelete}
                    />
                    {showSuccessPopup && (
                        <div className="success-popup-perfil">
                            <p>Dados salvos com sucesso!</p>
                        </div>
                    )}
                </div>
                <ModalExclusaoDeConta isExclui={openModalExclui} setContaExcluiOpen={() => setOpenModalExclui(!openModalExclui)} onDelete={handleDelete} />
                <ModalLogout isLogout={openModalLogout} setLogoutOpen={setOpenModalLogout} onLogout={handleLogout} />
                <ModalConfirmFoto
                    isOpen={isModalConfirmOpen}
                    onClose={() => setIsModalConfirmOpen(false)}
                    onConfirm={handleRemovePhoto}
                />
            </div>
        </div>
    )
}

export default PerfilOng
