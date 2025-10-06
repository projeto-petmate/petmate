import { useContext, useState } from 'react';
import { addCarrinho, addItemCarrinho, getCarrinhos } from '../apiService';
import './CardColeiraPronta.css'
import { FaCartPlus } from "react-icons/fa";
import { GlobalContext } from '../contexts/GlobalContext';
import Swal from 'sweetalert2'

function CardColeiraPronta() {
  const { userLogado, qtdItensCarrinho, setQtdItensCarrinho } = useContext(GlobalContext);
  // const [numItem, setNumItem] = useState(0)
  let id_usuario = userLogado?.id_usuario || null;
  let id_ong = userLogado?.id_ong || null;

  const addColeiraPronta = async (numItem) => {
    let carrinhos = await getCarrinhos(id_usuario || id_ong);
    let carrinho = Array.isArray(carrinhos) ? carrinhos.find(c => c.status === 'aberto') : null;
    let item = null

    if (!carrinho) {
      carrinho = await addCarrinho({
        id_usuario: id_usuario,
        id_ong: id_ong,
        valor_total: 0
      });
    }


    if (numItem === 1) {
      item = item1
    } else if (numItem === 2) {
      item = item2
    } else if (numItem === 3) {
      item = item3
    }


    await addItemCarrinho(carrinho.id_carrinho || carrinho.id, item);

    setQtdItensCarrinho(qtdItensCarrinho + 1);

    Swal.fire({
      title: 'Sucesso!',
      html: `
                    <div style="text-align: center;">
                        <p><strong>Coleira adicionada ao carrinho!</strong></p>
                    </div>
                `,
      icon: 'success',
      confirmButtonColor: '#84644D',
      timer: 5000,
      timerProgressBar: true
    });
    // window.location.reload()
  }

  const item1 = {
    modelo: 'Peitoral',
    tamanho: 'Pequena',
    cor_tecido: 'Preto',
    cor_logo: 'Branca',
    cor_argola: 'Prata',
    cor_presilha: 'Branca',
    valor: '30.00',
    imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1758217351/pets/i4nyci8zkjlccnkn1gqd.png',
    quantidade: 1
  };

  const item2 = {
    modelo: 'Cabresto',
    tamanho: 'Média',
    cor_tecido: 'Azul',
    cor_logo: 'Branco',
    cor_argola: 'Prata',
    cor_presilha: 'Preto',
    valor: '40.00',
    imagem: 'https://res.cloudinary.com/danyxbuuy/image/upload/v1759774404/pets/i5spm3pwsznymouxqy3s.png',
    quantidade: 1
  };

  const item3 = {
    modelo: 'Pescoço',
    tamanho: 'Grande',
    cor_tecido: 'Vermelho',
    cor_logo: 'Branca',
    cor_argola: 'Prata',
    cor_presilha: 'Branca',
    valor: '20.00',
    imagem: 'https://res-console.cloudinary.com/danyxbuuy/thumbnails/v1/image/upload/v1759774790/cGV0cy96NmhnaWplbndiczlkYTFtdmpjeQ==/drilldown',
    quantidade: 1
  };

  return (
    <div>
      <div className="container-coleira-pronta">
        <div className="card-coleira-pronta">
          <img src={item1.imagem} alt="" />
          <div className="valor-item">
            <span>R${parseFloat(item1.valor).toFixed(2)}</span>
          </div>
          {/* <p>Coleira Pronta</p> */}
          <span className="detalhes-item-pronto">
            <span className='chips-coleira-pronta'>
              Modelo: {item1.modelo}
            </span>
            <span className='chips-coleira-pronta'>
              Tamanho: {item1.tamanho}
            </span>
            <span className='chips-coleira-pronta'>
              Tecido: {item1.cor_tecido}
            </span>
            <span className='chips-coleira-pronta'>
              Logo: {item1.cor_logo}
            </span>
            <span className='chips-coleira-pronta'>
              Argola: {item1.cor_argola}
            </span>
            <span className='chips-coleira-pronta'>
              Presilha: {item1.cor_presilha}
            </span>
          </span>
          <div className="container-add-carrinho" onClick={() => { addColeiraPronta(1) }}>
            <FaCartPlus className="icon-add-carrinho" />
            <p>Adicionar ao carrinho</p>
          </div>
        </div>
        <div className="card-coleira-pronta">
          <img src={item2.imagem} alt="" />
          <div className="valor-item">
            <span>R${parseFloat(item2.valor).toFixed(2)}</span>
          </div>
          {/* <p>Coleira Pronta</p> */}
          <span className="detalhes-item-pronto">
            <span className='chips-coleira-pronta'>
              Modelo: {item2.modelo}
            </span>
            <span className='chips-coleira-pronta'>
              Tamanho: {item2.tamanho}
            </span>
            <span className='chips-coleira-pronta'>
              Tecido: {item2.cor_tecido}
            </span>
            <span className='chips-coleira-pronta'>
              Logo: {item2.cor_logo}
            </span>
            <span className='chips-coleira-pronta'>
              Argola: {item2.cor_argola}
            </span>
            <span className='chips-coleira-pronta'>
              Presilha: {item2.cor_presilha}
            </span>
          </span>
          <div className="container-add-carrinho" onClick={() => { addColeiraPronta(2) }}>
            <FaCartPlus className="icon-add-carrinho" />
            <p>Adicionar ao carrinho</p>
          </div>
        </div>
        <div className="card-coleira-pronta">
          <img src={item3.imagem} alt="" />
          <div className="valor-item">
            <span>R${parseFloat(item3.valor).toFixed(2)}</span>
          </div>
          {/* <p>Coleira Pronta</p> */}
          <span className="detalhes-item-pronto">
            <span className='chips-coleira-pronta'>
              Modelo: {item3.modelo}
            </span>
            <span className='chips-coleira-pronta'>
              Tamanho: {item3.tamanho}
            </span>
            <span className='chips-coleira-pronta'>
              Tecido: {item3.cor_tecido}
            </span>
            <span className='chips-coleira-pronta'>
              Logo: {item3.cor_logo}
            </span>
            <span className='chips-coleira-pronta'>
              Argola: {item3.cor_argola}
            </span>
            <span className='chips-coleira-pronta'>
              Presilha: {item3.cor_presilha}
            </span>
          </span>
          <div className="container-add-carrinho" onClick={() => { addColeiraPronta(3) }}>
            <FaCartPlus className="icon-add-carrinho" />
            <p>Adicionar ao carrinho</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardColeiraPronta
