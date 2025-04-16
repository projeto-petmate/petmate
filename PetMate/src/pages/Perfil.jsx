import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Perfil.css';
import { FaCheck, FaUnlock, FaEdit, FaUserCircle, FaLock } from "react-icons/fa";
import { BsDoorOpenFill } from "react-icons/bs";
import { GlobalContext } from '../contexts/GlobalContext';
import ModalExclusaoDeConta from '../components/ModalExclusaoDeConta';
import ModalLogout from '../components/ModalLogout';
import CardPetPerfil from '../components/CardPetPerfil';
import PerfilOng from '../components/PerfilOng';
import { useNavigate } from 'react-router-dom';
import { getPets } from '../apiService';

function Perfil() {
    const { userLogado, Logout, updateUsuario, deleteUsuario } = useContext(GlobalContext);
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState(userLogado || {});
    const [userPets, setUserPets] = useState([]);
    const [openModalExclui, setOpenModalExclui] = useState(false);
    const [openModalLogout, setOpenModalLogout] = useState(false);
    const [imagemPreviewPerfil, setImagemPreviewPerfil] = useState(userLogado?.imagem || null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPets = async () => {
            try {
                const pets = await getPets();
                const filteredPets = pets.filter(pet => pet.id_usuario === userLogado.id);
                setUserPets(filteredPets);
            } catch (error) {
                console.error("Erro ao buscar pets do usuário:", error);
            }
        };

        if (userLogado?.id) {
            fetchUserPets();
        }
    }, [userLogado]);

    const handleLogout = () => {
        Logout(); // Chama a função Logout do contexto
        navigate('/home'); // Redireciona para a página inicial
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateUsuario(userData.id, userData);
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
            await deleteUsuario(userData.id);
            handleLogout();
        } catch (error) {
            console.error('Erro ao deletar usuário', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setUserData((prevData) => ({ ...prevData, imagem: reader.result }));
            setImagemPreviewPerfil(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <Navbar />
            <div className="container-perfil">
                {userLogado?.tipo === 'ong' ? (
                    <PerfilOng />
                ) : (
                    <div className="info-perfil">
                        <div className="container-configuracoes">
                            <div className="titulo-barra">
                                <h2>Configurações de Conta</h2>
                                <img src="/images/barra_marrom.png" className='barra-perfil' />
                                <h4>Dados do Perfil</h4>
                            </div>
                            <div className="sair-conta">
                                <button className="botao-sair-logout" onClick={() => setOpenModalLogout(true)}>
                                    <BsDoorOpenFill className='icon-logout' />
                                </button>
                            </div>
                        </div>
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
                            {editMode && <p className="trocar-foto-texto">Clique no ícone para alterar sua imagem de perfil</p>}
                        </div>
                        <div className="inputs-perfil">
                            <div className="inputs-perfil-1">
                                <div className="input-perma">
                                    <p className='dadoPerma'>Email*</p>
                                    <div className='input-perma-lock'>
                                        <input
                                            type="text"
                                            name="email"
                                            value={userData.email || ''}
                                            disabled
                                        />
                                        <FaLock className='icon-lock' />
                                    </div>
                                </div>
                                <div className="input-nome">
                                    <p>Nome</p>
                                    <div className="input-edit">
                                        <input
                                            type="text"
                                            name="nome"
                                            value={userData.nome || ''}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                        {!editMode ? (
                                            <FaLock className='icon-lock' onClick={() => setEditMode(true)} />
                                        ) : (
                                            <FaUnlock className='icon-lock' onClick={handleSave} />
                                        )}
                                    </div>
                                </div>
                                <div className="input-nome">
                                    <p>Senha</p>
                                    <div className="input-edit">
                                        <input
                                            type="password"
                                            name="senha"
                                            value={userData.senha || ''}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                        {!editMode ? (
                                            <FaLock className='icon-lock' onClick={() => setEditMode(true)} />
                                        ) : (
                                            <FaUnlock className='icon-lock' onClick={handleSave} />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputs-perfil-2">
                                <div className="input-perma">
                                    <p className='dadoPerma'>CPF*</p>
                                    <div className="input-perma-lock">
                                        <input
                                            type="text"
                                            name="cpf"
                                            value={userData.cpf || ''}
                                            disabled
                                        />
                                        <FaLock className='icon-lock' />
                                    </div>
                                </div>
                                <div className="input-nome">
                                    <p>Endereço</p>
                                    <div className="input-edit">
                                        <input
                                            type="text"
                                            name="endereco"
                                            value={userData.endereco || ''}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                        {!editMode ? (
                                            <FaLock className='icon-lock' onClick={() => setEditMode(true)} />
                                        ) : (
                                            <FaUnlock className='icon-lock' onClick={handleSave} />
                                        )}
                                    </div>
                                </div>
                                <div className="input-nome">
                                    <p>Telefone</p>
                                    <div className="input-edit">
                                        <input
                                            type="text"
                                            name="telefone"
                                            value={userData.telefone || ''}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                        {!editMode ? (
                                            <FaLock className='icon-lock' onClick={() => setEditMode(true)} />
                                        ) : (
                                            <FaUnlock className='icon-lock' onClick={handleSave} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="botoes-perfil">
                            <div className="editar-conta">
                                {!editMode ? (
                                    <button className='botao-editar-perfil' onClick={() => setEditMode(true)} >
                                        <div className="editar-dados">
                                            Clique para editar
                                            <FaEdit className='icon-edit' />
                                        </div>
                                    </button>
                                ) : (
                                    <button className="botao-salvar-perfil" onClick={handleSave}>
                                        <div className="salvar-dados">
                                            Salvar
                                            <FaCheck className='icon-edit' />
                                        </div>
                                    </button>
                                )}
                                <h4>Editar dados do perfil</h4>
                            </div>
                            <div className="excluir-conta">
                                <button className="botao-excluir-perfil" onClick={() => setOpenModalExclui(true)}>Excluir</button>
                                <h4>Excluir conta permanentemente</h4>
                            </div>
                        </div>
                    </div>
                )}
                <div className="container-pets">
                    <CardPetPerfil />
                </div>
            </div>
            {showSuccessPopup && (
                <div className="success-popup-perfil">
                    <p>Dados salvos com sucesso!</p>
                </div>
            )}
            <ModalExclusaoDeConta isExclui={openModalExclui} setContaExcluiOpen={() => setOpenModalExclui(!openModalExclui)} onDelete={handleDelete} />
            <ModalLogout isLogout={openModalLogout} setLogoutOpen={setOpenModalLogout} onLogout={handleLogout} />
        </div>
    );
}

export default Perfil;