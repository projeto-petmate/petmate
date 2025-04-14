import React, { useEffect, useState } from 'react';
import { getUsuarios, deleteUsuario, updateUsuario } from '../apiService';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import './UsersAdm.css';
import ModalExcluirUser from './ModalExcluirUser';
import ModalEditarUser from './ModalEditarUser';

function UsersAdm() {
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [openModalExcluirUser, setOpenModalExcluirUser] = useState(false);
  const [openModalEditarUser, setOpenModalEditarUser] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsuarios();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    try {
      await deleteUsuario(userToDelete.id_usuario);
      setUsers(users.filter((user) => user.id_usuario !== userToDelete.id_usuario));
      setOpenModalExcluirUser(false);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      await updateUsuario(updatedUser.id_usuario, updatedUser);
      setUsers(users.map((user) => (user.id_usuario === updatedUser.id_usuario ? updatedUser : user)));
      setOpenModalEditarUser(false);
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
    }
  };

  return (
    <div className="users-adm-container">
      <h2 className='title-lista-users'>Lista de Usuários</h2>
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id_usuario} className="user-card">
            <div className="user-photo">
              {user.imagem ? (
                <img src={user.imagem} alt={`Foto de ${user.nome}`} />
              ) : (
                <FaUserCircle className="default-user-icon" />
              )}
            </div>
            <div className="user-info">
              <h3>{user.nome} {user.sobrenome}</h3>
              <p>ID: {user.id_usuario}</p>
            </div>
            <div className="user-actions">
              <FaEdit
                className='botao-editar-user'
                onClick={() => {
                  setUserToEdit(user);
                  setOpenModalEditarUser(true);
                }}
                title="Editar Usuário"
              />
              <IoTrashOutline
                className="botao-excluir-user"
                onClick={() => {
                  setUserToDelete(user);
                  setOpenModalExcluirUser(true);
                }}
                title="Excluir Usuário"
              />
            </div>
          </div>
        ))}
      </div>
      <ModalExcluirUser
        isExcluirUser={openModalExcluirUser}
        setUserDeleteOpen={setOpenModalExcluirUser}
        onDeleteUser={handleDeleteUser}
      />
      <ModalEditarUser
        isEditarUser={openModalEditarUser}
        setUserEditOpen={setOpenModalEditarUser}
        onEditUser={handleEditUser}
        userToEdit={userToEdit}
      />
    </div>
  );
}

export default UsersAdm;