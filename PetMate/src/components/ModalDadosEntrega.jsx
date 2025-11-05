import './ModalDadosEntrega.css';
import { IoLocationSharp } from "react-icons/io5";

function ModalDadosEntrega() {
  return (
    <div className="overlay-entrega">
      <div className="container-entrega">
        
        {/* Cabeçalho do Modal */}
        <div className="header-entrega">
          <IoLocationSharp className='icon-location'/>
          <h2 className="title-entrega">Preencha os dados para entrega</h2>
        </div>

        {/* Formulário de Entrega */}
        <form className="form-entrega">
          
          {/* Coluna Esquerda */}
          <div className="column-entrega">
            <label htmlFor="cep">CEP</label>
            <input type="text" id="cep" name="cep" className="input-entrega" required />

            <label htmlFor="estado">Estado (UF)</label>
            <input type="text" id="estado" name="estado" className="input-entrega" required />

            <label htmlFor="cidade">Cidade</label>
            <input type="text" id="cidade" name="cidade" className="input-entrega" required />

            <label htmlFor="bairro">Bairro</label>
            <input type="text" id="bairro" name="bairro" className="input-entrega" required />

            <label htmlFor="logradouro">Logradouro (Rua / Avenida)</label>
            <input type="text" id="logradouro" name="logradouro" className="input-entrega" required />
          </div>
          
          {/* Coluna Direita */}
          <div className="form-entrega">
            <label htmlFor="nome-destinatario">Nome completo do destinatário</label>
            <input type="text" id="nome-destinatario" name="nome-destinatario" className="input-entrega" required />

            <label htmlFor="numero-residencia">Número da residência</label>
            <input type="text" id="numero-residencia" name="numero-residencia" className="input-entrega" required />

            <label htmlFor="complemento">Complemento (opcional)</label>
            <input type="text" id="complemento" name="complemento" className="input-entrega" />

            <label htmlFor="telefone">Telefone / WhatsApp</label>
            <input type="tel" id="telefone" name="telefone" className="input-entrega" required />

            <label htmlFor="observacoes">Observações para o entregador (opcional)</label>
            <input type="text" id="observacoes" name="observacoes" className="input-entrega" />
          </div>
          
          {/* Botões */}
          <div className="botoes-entrega">
            <button type="submit" className="button-confirm">
              Fechar carrinho
            </button>
            <button type="button" className="button-back">
              voltar
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}

export default ModalDadosEntrega