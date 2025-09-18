import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';
import { FaUserCircle } from "react-icons/fa";
import ModalAnunciarPet from "../components/ModalAnunciarPet";
import { GlobalContext } from '../contexts/GlobalContext';
import { FiShoppingCart } from "react-icons/fi";
import { getQuantidadeItensCarrinho } from '../apiService';


function NavLogado() {
  const { userLogado } = useContext(GlobalContext);
  const [openModal, setOpenCadModal] = useState(false);
  const [qtdItens, setQtdItens] = useState(0)

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

useEffect(() => {
    const buscarQtdItensCarrinho = async () => {
      if (!userLogado) return;

      try {
        let response = null;
        
        if (userLogado.tipo === 'usuario') {
          const id_req = userLogado.id_usuario;
          response = await getQuantidadeItensCarrinho({ id_usuario: id_req });
        } else if (userLogado.tipo === 'ong') {
          const id_req = userLogado.id_ong;
          response = await getQuantidadeItensCarrinho({ id_ong: id_req });
        }
        
        // Extrair a quantidade do objeto de resposta
        const qtd = response?.quantidade || 0;
        setQtdItens(qtd);
        
        console.log('Quantidade de itens no carrinho:', qtd);
      } catch (error) {
        console.error('Erro ao buscar quantidade de itens:', error);
        setQtdItens(0);
      }
    };

    buscarQtdItensCarrinho();
  }, [userLogado]);

  

  const userName = userLogado?.tipo === 'ong'
    ? userLogado.nome_ong
    : getFirstName(userLogado?.nome || '');

  const userIcon = userLogado?.tipo === 'ong'
    ? userLogado.foto_perfil
    : userLogado?.imagem;

  return (
    <div className='nav-logado'>

      <>
        <button className='botao-modal-navbar' onClick={() => setOpenCadModal(true)}>Anunciar Pet</button>
        <p className="boas-vindas">
          {userLogado && `Olá, ${userName}!`}
        </p>
        <div className="user-icon-container-nav">
          <Link to="/perfil">
            {userIcon ? (
              <img src={userIcon} alt="User Icon" className="nav-profile" />
            ) : (
              <FaUserCircle className="profile" />
            )}
          </Link>
          <span className="texto-perfil">Ir para o perfil</span>
        </div>
        <ModalAnunciarPet isOpen={openModal} setModalOpen={() => setOpenCadModal(!openModal)} />

        <div className="carrinho-container">
          <Link to="/carrinho">
            <FiShoppingCart className='icon-carrinho'/>
          </Link>
          {qtdItens > 0 && (
            <span className="badge-carrinho">{qtdItens}</span>
          )}
        </div>
      </>

    </div>
  );
}

export default NavLogado;