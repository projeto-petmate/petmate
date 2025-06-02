import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Perfil.css';
import { FaCheck, FaUnlock, FaEdit, FaUserCircle, FaLock, FaTrash, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { BsDoorOpenFill } from "react-icons/bs";
import { GlobalContext } from '../contexts/GlobalContext';
import ModalExclusaoDeConta from '../components/ModalExclusaoDeConta';
import ModalLogout from '../components/ModalLogout';
import CardPetPerfil from '../components/CardPetPerfil';
import PerfilOng from '../components/PerfilOng';
import { useNavigate } from 'react-router-dom';
import { getPets } from '../apiService';
import { TbMoodEdit } from 'react-icons/tb';
import ModalConfirmFoto from '../components/ModalConfirmFoto';
import ModalConfirmarEdit from '../components/ModalConfirmarEdit';

function Perfil() {
    const { userLogado, Logout, updateUsuario, deleteUsuario, logado } = useContext(GlobalContext);
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userPets, setUserPets] = useState([]);
    const [openModalExclui, setOpenModalExclui] = useState(false);
    const [openModalLogout, setOpenModalLogout] = useState(false);
    const [imagemPreviewPerfil, setImagemPreviewPerfil] = useState(userLogado?.imagem || null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openModalConfirmEdit, setOpenModalConfirmEdit] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();

  
    useEffect (() => {
      if(logado !== true){
        navigate('/home')
      }
    })

    const handleRemovePhoto = () => {
        setImagemPreviewPerfil(null);
        setUserData((prevData) => ({ ...prevData, imagem: null }));
        document.getElementById('file-upload').value = null;
        setIsModalOpen(false);
    };

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

    useEffect(() => {
        if (userLogado) {
            setUserData(userLogado);
            setIsLoading(false);
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
            if (!userData.id_usuario) {
                console.error("Erro: ID do usuário não definido.");
                return;
            }

            await updateUsuario(userData.id_usuario, userData);
            setEditMode(false);
            setShowSuccessPopup(true);
            setOpenModalConfirmEdit(false)
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 2000);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
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
            setUserData((prevData) => ({ ...prevData, imagem: reader.result }));
            setImagemPreviewPerfil(reader.result);
        };
        reader.readAsDataURL(file);
    };
    if (isLoading) {
        return <div className="loading">Carregando...</div>;
    }


    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
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
                        {/* <div className="user-icon-container">
                            <div className="add-img">
                                <input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    disabled={!editMode}
                                />
                            </div>
                            {imagemPreviewPerfil || userData?.imagem ? (
                                <div
                                    className="img-preview-perfil"
                                    onClick={() => editMode && document.getElementById('file-upload').click()}
                                >
                                    <img
                                        src={imagemPreviewPerfil || userData?.imagem}
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
                                {(imagemPreviewPerfil || userData?.imagem) && (
                                    <FaTrash
                                        className="icon-trash"
                                        onClick={() => {
                                            if (editMode) {
                                                setIsModalOpen(true);
                                            }
                                        }}
                                        style={{ cursor: editMode ? 'pointer' : 'not-allowed', opacity: editMode ? 1 : 0.5 }}
                                    />
                                )}
                            </div>
                            {editMode && <p className="trocar-foto-texto">Clique no ícone para alterar sua imagem de perfil</p>} */}
                        {/* </div> */}
                        <div className="inputs-perfil">
                            <div className="inputs-perfil-1">
                                <div className="input-perma">
                                    <p className='dadoPerma'>Email*</p>
                                    <div className='input-perma-lock'
                                    >
                                        <input
                                            type="text"
                                            name="email"
                                            value={userData.email || ''}
                                            disabled
                                        />
                                        <FaLock className='icon-lock'
                                            style={{ cursor: 'not-allowed' }} />
                                    </div>
                                </div>
                                <div className="input-editavel">
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
                                <div className="input-editavel">
                                    <p>Senha</p>
                                    <div className="input-edit">
                                        <input
                                            type={mostrarSenha ? "text" : "password"}
                                            name="senha"
                                            value={userData?.senha}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            id='inpt-senha-perfil'
                                        />
                                        {!editMode ? (
                                            <FaLock className='icon-lock' onClick={() => setEditMode(true)} />
                                        ) : (
                                            <>
                                                <button
                                                    onClick={toggleMostrarSenha}
                                                    className='icon-mostrar-senha-perfil-user'
                                                    type="button"
                                                >
                                                    {mostrarSenha ? <FaRegEyeSlash /> : <FaRegEye />}
                                                </button>
                                                <FaUnlock className='icon-lock' onClick={handleSave} />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="input-editavel">
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
                                        <FaLock className='icon-lock'
                                            style={{ cursor: 'not-allowed' }} />
                                    </div>
                                </div>
                                <div className="input-editavel">
                                    <p>UF</p>
                                    <div className="input-edit">
                                        <select
                                            id="estado"
                                            name="uf"
                                            className="uf-perfil-user"
                                            value={userData.uf || ''}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        >
                                            <option value="" disabled>Selecione o estado</option>
                                            <option value="AC">Acre (AC)</option>
                                            <option value="AL">Alagoas (AL)</option>
                                            <option value="AP">Amapá (AP)</option>
                                            <option value="AM">Amazonas (AM)</option>
                                            <option value="BA">Bahia (BA)</option>
                                            <option value="CE">Ceará (CE)</option>
                                            <option value="DF">Distrito Federal (DF)</option>
                                            <option value="ES">Espírito Santo (ES)</option>
                                            <option value="GO">Goiás (GO)</option>
                                            <option value="MA">Maranhão (MA)</option>
                                            <option value="MT">Mato Grosso (MT)</option>
                                            <option value="MS">Mato Grosso do Sul (MS)</option>
                                            <option value="MG">Minas Gerais (MG)</option>
                                            <option value="PA">Pará (PA)</option>
                                            <option value="PB">Paraíba (PB)</option>
                                            <option value="PR">Paraná (PR)</option>
                                            <option value="PE">Pernambuco (PE)</option>
                                            <option value="PI">Piauí (PI)</option>
                                            <option value="RJ">Rio de Janeiro (RJ)</option>
                                            <option value="RN">Rio Grande do Norte (RN)</option>
                                            <option value="RS">Rio Grande do Sul (RS)</option>
                                            <option value="RO">Rondônia (RO)</option>
                                            <option value="RR">Roraima (RR)</option>
                                            <option value="SC">Santa Catarina (SC)</option>
                                            <option value="SP">São Paulo (SP)</option>
                                            <option value="SE">Sergipe (SE)</option>
                                            <option value="TO">Tocantins (TO)</option>
                                        </select>
                                        {!editMode ? (
                                            <FaLock className='icon-lock' onClick={() => setEditMode(true)} />
                                        ) : (
                                            <FaUnlock className='icon-lock' onClick={handleSave} />
                                        )}
                                    </div>
                                </div>
                                <div className="input-editavel">
                                    <p>Cidade</p>
                                    <div className="input-edit">
                                        <input
                                            type="text"
                                            name="cidade"
                                            value={userData.cidade || ''}
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
                                <div className="input-editavel">
                                    <p>Bairro</p>
                                    <div className="input-edit">
                                        <input
                                            type="text"
                                            name="bairro"
                                            value={userData.bairro || ''}
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
                                            Editar dados
                                            <FaEdit className='icon-edit' />
                                        </div>
                                    </button>
                                ) : (
                                    <button className="botao-salvar-perfil" onClick={() => setOpenModalConfirmEdit(true)}>
                                        <div className="salvar-dados">
                                            Salvar dados
                                            <FaCheck className='icon-edit' />
                                        </div>
                                    </button>
                                )}
                                {/* <h4>Editar dados do perfil</h4> */}
                            </div>
                            <div className="excluir-conta">
                                <button className="botao-excluir-perfil" onClick={() => setOpenModalExclui(true)}>Excluir conta</button>
                                {/* <h4>Excluir conta permanentemente</h4> */}
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
            <ModalConfirmarEdit
                isOpen={openModalConfirmEdit}
                setEditConfirmOpen={setOpenModalConfirmEdit}
                onConfirm={handleSave}
            />
            <ModalExclusaoDeConta isExclui={openModalExclui} setContaExcluiOpen={() => setOpenModalExclui(!openModalExclui)} onDelete={handleDelete} />
            <ModalLogout isLogout={openModalLogout} setLogoutOpen={setOpenModalLogout} onLogout={handleLogout} />
            <ModalConfirmFoto
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleRemovePhoto}
            />
        </div>
    );
}

export default Perfil;