import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Perfil.css';
import { FiLogOut } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import ModalExclusaoDeConta from '../components/ModalExclusaoDeConta';
import { useNavigate } from 'react-router-dom';
import { getPets } from '../apiService';
import CardPetPerfil from '../components/CardPetPerfil';
import ModalLogout from '../components/ModalLogout';
import { FaUserCircle } from "react-icons/fa";


function Perfil() {
    const [openModalExclui, setOpenModalExclui] = useState(false);
    const { userLogado, PhoneInput, Logout, updateUsuario, deleteUsuario } = useContext(GlobalContext);
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState(userLogado || {});
    const [userPets, setUserPets] = useState([]);
    const [openModal, setOpenCadModal] = useState(false);
    const [openModalLogout, setOpenModalLogout] = useState(false);
    const [imagem, setImagem] = useState('');
    const [imagemPreviewPerfil, setImagemPreviewPerfil] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPets = async () => {
            try {
                const pets = await getPets();
                const filteredPets = pets.filter(pet => pet.id_usuario === userLogado.id_usuario);
                setUserPets(filteredPets);
            } catch (error) {
                console.error("Erro ao buscar pets do usuário:", error);
            }
        };

        if (userLogado) {
            fetchUserPets();
        }
    }, [userLogado]);

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
            await updateUsuario(userData.id_usuario, userData);
            setEditMode(false);
        } catch (error) {
            console.error('Erro ao atualizar usuário', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUsuario(userData.id_usuario);
            handleLogout();
        } catch (error) {
            console.error('Erro ao deletar usuário', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagem(reader.result);
            setImagemPreviewPerfil(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <Navbar />
            <div className="container-perfil">
                <div className="container-pets">
                    <CardPetPerfil />
                </div>
                <div className="info-perfil">
                    <div className="container-configuracoes">
                        <div className="titulo-barra">
                            <h2>Configurações de Conta</h2>
                            <img src="/images/barra_marrom.png" className='barra-perfil' />
                            <h4>Dados do Perfil</h4>
                        </div>
                        <div className="sair-conta">
                            <button className="botao-sair-logout" onClick={() => setOpenModalLogout(true)}>
                                <FiLogOut className='icon-logout' />
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

                        {imagemPreviewPerfil === null ?
                            <FaUserCircle className='user-icon' onClick={() => document.getElementById('file-upload').click()} /> :
                            <div className="img-preview-perfil" >
                                {imagemPreviewPerfil && (
                                    <img src={imagemPreviewPerfil} alt="Pré-visualização" className="imagem-preview-perfil" />
                                )}
                            </div>
                        }
                    </div>

                    <div className="inputs-perfil">
                        <div className="inputs-perfil-1">
                            <div className="input-perma">
                                <p className='dadoPerma'>Email*</p>
                                <div>
                                    <input
                                        type="text"
                                        name="email"
                                        value={userData.email || ''}
                                        disabled
                                    />
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
                                    <FaEdit className='icon-lapis' />
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
                                    <FaEdit className='icon-lapis' />
                                </div>
                            </div>
                        </div>
                        <div className="inputs-perfil-2">
                            <div className="input-perma">
                                <p className='dadoPerma'>CPF*</p>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={userData.cpf || ''}
                                    disabled
                                />
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
                                    <FaEdit className='icon-lapis' />
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
                                    <FaEdit className='icon-lapis' />
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <div className="excluir-conta">
                        <h4>Excluir conta permanentemente</h4>
                        <button className="botao-excluir-perfil" onClick={() => setOpenModalExclui(true)}>Excluir</button>
                    </div>
                </div>
            </div>
            <ModalExclusaoDeConta isExclui={openModalExclui} setContaExcluiOpen={() => setOpenModalExclui(!openModalExclui)} onDelete={handleDelete} />
            <ModalLogout isLogout={openModalLogout} setLogoutOpen={setOpenModalLogout} onLogout={handleLogout} />
        </div>
    );
}

export default Perfil;