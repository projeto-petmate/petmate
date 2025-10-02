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
      <div className="img-nome-produto">
        <div className="img-item-carrinho">
          {item.imagem ? (
            <img src={item.imagem} alt="Coleira personalizada" />
          ) : (
            <div className="placeholder-imagem">
              Sem imagem
            </div>
          )}
        </div>

        <span className="detalhes-item">
          {/* <div className="linha-chips-1"> */}
            <span className='chips-coleira'>
              Modelo: {item.modelo}
            </span> 
            <span className='chips-coleira'>
              Tamanho: {item.tamanho}
            </span> 
            <span className='chips-coleira'>
              Tecido: {item.cor_tecido}
            </span>
          {/* </div> */}
          {/* <div className="linha-chips-2"> */}
            <span className='chips-coleira'>
              Logo: {item.cor_logo}
            </span> 
            <span className='chips-coleira'>
              Argola: {item.cor_argola}
            </span> 
            <span className='chips-coleira'>
              Presilha: {item.cor_presilha}
            </span>
          {/* </div> */}
        </span>
      </div>


      {/* <div className="container-detalhes-item"> */}
      {/* <div className="nome-preco-item"> */}
      {/* <b>Coleira personalizada</b> */}
      {/* <div className="cores-item">
          <span>Tecido: {item.cor_tecido}</span>
          <span>Logo: {item.cor_logo}</span>
          <span>Argola: {item.cor_argola}</span>
          <span>Presilha: {item.cor_presilha}</span>
        </div> */}
      {/* </div> */}
      <div className="preco-e-qtd-item">
        <div className="valor-item">
          <span>R${parseFloat(item.valor).toFixed(2)}</span>
        </div>
        <div className="container-qtd-item">
          <button
            className="btn-qtd"
            onClick={handleDecrementar}
            title={item.quantidade > 1 ? "Diminuir quantidade" : "Remover item"}
          >
            {item.quantidade > 1 ? <FaMinus /> : <FaTrash />}
          </button>
          <span>{item.quantidade}</span>
          <button
            className="btn-qtd"
            onClick={handleIncrementar}
            title="Aumentar quantidade"
          >
            <FaPlus />
          </button>
        </div>
        <div className="subtotal-item">
          <span>R${(parseFloat(item.valor) * item.quantidade).toFixed(2)}</span>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default CardItemCarrinho;