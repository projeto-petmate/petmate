import React from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import './CardItemCarrinho.css';

function CardItemCarrinho({ item, onQuantidadeChange, onRemover }) {
  
  const handleIncrementar = () => {
    if (onQuantidadeChange) {
      onQuantidadeChange(item.id_item, item.quantidade + 1);
    }
  };

  const handleDecrementar = () => {
    if (item.quantidade > 1 && onQuantidadeChange) {
      onQuantidadeChange(item.id_item, item.quantidade - 1);
    } else if (onRemover) {
      onRemover(item.id_item);
    }
  };

  const handleRemover = () => {
    if (onRemover) {
      onRemover(item.id_item);
    }
  };

  return (
    <div className='card-item-carrinho'>
      {item.imagem ? (
        <img src={item.imagem} alt="Coleira personalizada" />
      ) : (
        <div className="placeholder-imagem">
          Sem imagem
        </div>
      )}
      
      <div className="nome-preco-item">
        <b>Coleira personalizada</b>
        <span>Valor: R${parseFloat(item.valor).toFixed(2)}</span>
        <span className="detalhes-item">
          {item.modelo} • {item.tamanho}
        </span>
        {/* <div className="cores-item">
          <span>Tecido: {item.cor_tecido}</span>
          <span>Logo: {item.cor_logo}</span>
          <span>Argola: {item.cor_argola}</span>
          <span>Presilha: {item.cor_presilha}</span>
        </div> */}
      </div>
      
      <div className="container-qtd-item">
        <button 
          className="btn-qtd"
          onClick={handleDecrementar}
          title={item.quantidade > 1 ? "Diminuir quantidade" : "Remover item"}
        >
          {item.quantidade > 1 ? <FaMinus /> : <FaTrash />}
        </button>
        <span>Qtd: {item.quantidade}</span>
        <button 
          className="btn-qtd"
          onClick={handleIncrementar}
          title="Aumentar quantidade"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}

export default CardItemCarrinho;