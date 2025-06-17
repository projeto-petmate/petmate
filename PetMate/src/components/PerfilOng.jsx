import React, { useContext, useEffect } from 'react'
import './PerfilOng.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CardPetPerfil from '../components/CardPetPerfil';
import { FiLogOut } from "react-icons/fi";
import { FaEdit, FaRegEye, FaRegEyeSlash, FaTrash } from "react-icons/fa";
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
import ModalConfirmarEdit from './ModalConfirmarEdit';

function PerfilOng() {
    const [editMode, setEditMode] = useState(false);
    const [openModalExclui, setOpenModalExclui] = useState(false);
    const { userLogado, Logout } = useContext(GlobalContext);
    const [userData, setUserData] = useState(null);
    const [openModalLogout, setOpenModalLogout] = useState(false);
    const [imagemPreviewPerfil, setImagemPreviewPerfil] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [openModalConfirmEdit, setOpenModalConfirmEdit] = useState(false);
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
            setOpenModalConfirmEdit(false);
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

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    return (
        <div>
            <div className='container-config-conta-ong'>
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
                <p className='texto-dados-perfil'>Dados do Perfil</p>
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
                    { editMode &&
                        <div className="icon-trash-container">
                        {(imagemPreviewPerfil || userData?.foto_perfil) && (
                            <FaTrash
                            className="icon-trash"
                            onClick={() => {
                                if (editMode) {
                                    setIsModalConfirmOpen(true);
                                }
                            }}
                            style={{ cursor: editMode ? 'pointer' : 'not-allowed', opacity: editMode ? 1 : 0.5 }}
                            />
                        )}
                    </div>
                    }

                    {editMode && <p className="trocar-foto-texto">Clique no ícone para alterar sua imagem de perfil ou na lixeira para excluir ela</p>}

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
                                type={mostrarSenha ? "text" : "password"}
                                name="senha"
                                value={userData?.senha || ''}
                                onChange={handleChange}
                                disabled={!editMode}
                            />
                            {!editMode ? (
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} />
                            ) : (
                                <>
                                    <button
                                        onClick={toggleMostrarSenha}
                                        className='icon-mostrar-senha-perfil-ong'
                                        type="button"
                                    >
                                        {mostrarSenha ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                    <FaUnlock className='icon-cadeado' onClick={handleSave} />
                                </>
                            )}
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                        <label className='descricao-inputs'>Estado:</label>
                        <div className="input-ongs-mostra-info">
                            <select
                                id="estado"
                                name="uf"
                                className="input-6"
                                value={userData?.estado || ''}
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} />
                            ) : (
                                <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            )}
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
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
                                <FaLock className='icon-cadeado' onClick={() => setEditMode(true)} /> : <FaUnlock className='icon-cadeado' onClick={handleSave} />
                            }
                        </div>
                    </div>

                </div>
                <div className="botoes">
                    <div className="botoes-perfil-ong">
                        {!editMode ? (
                            <button className='botao-editar-perfil-ong' onClick={() => setEditMode(true)}>
                                <div className="editar-dados">
                                    Editar Dados
                                    <FaEdit className='icon-edit' />
                                </div>
                            </button>
                        ) : (
                            <button className="botao-salvar-dados" onClick={() => setOpenModalConfirmEdit(true)}>
                                <div className="salvar-dados">
                                    Salvar Dados
                                    <FaCheck className='icon-edit' />
                                </div>
                            </button>
                        )}
                        <button className="botao-perfil-excluir-ong" onClick={() => setOpenModalExclui(true)}>Excluir conta</button>
                        {/* <h4>Excluir conta permanentemente</h4> */}
                    </div>
                    <ModalConfirmarEdit
                        isOpen={openModalConfirmEdit}
                        setEditConfirmOpen={setOpenModalConfirmEdit}
                        onConfirm={handleSave}
                    />
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
