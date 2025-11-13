import './ModalDadosEntrega.css';
import { IoLocationSharp } from "react-icons/io5";
import { CgCloseO } from 'react-icons/cg';
import { useState, useEffect } from 'react';
import { finalizarCarrinho } from '../apiService';
import Swal from 'sweetalert2';
import InputMask from 'react-input-mask'

function ModalDadosEntrega({
  isOpen,
  setIsOpen,
  carrinhoAtual,
  itens,
  subtotal,
  userLogado,
  onPedidoFinalizado
}) {

  // ESTADOS DOS INPUTS
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState(userLogado.uf || '');
  const [cidade, setCidade] = useState(userLogado.cidade || '');
  const [bairro, setBairro] = useState(userLogado.bairro || '');
  const [logradouro, setLogradouro] = useState('');
  const [nomeDestinatario, setNomeDestinatario] = useState('');
  const [numeroResidencia, setNumeroResidencia] = useState('');
  const [complemento, setComplemento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [cepValido, setCepValido] = useState(null);
  const [buscandoCep, setBuscandoCep] = useState(false);

  // ESTADO DE LOADING
  const [finalizandoPedido, setFinalizandoPedido] = useState(false);

  const buscarCep = async (cepLimpo) => {
    if (cepLimpo.length !== 8) {
      setCepValido(false);
      return;
    }

    try {
      setBuscandoCep(true);
      setCepValido(null);

      console.log(`Buscando CEP: ${cepLimpo}`);

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepValido(false);
        return;
      }

      //  PREENCHER AUTOMATICAMENTE OS CAMPOS
      setEstado(data.uf);
      setCidade(data.localidade);
      setBairro(data.bairro || '');
      setLogradouro(data.logradouro || '');

      setCepValido(true);

      console.log(' CEP encontrado:', data);

    } catch (error) {
      console.error('❌ Erro ao buscar CEP:', error);
      setCepValido(false);
    } finally {
      setBuscandoCep(false);
    }
  };

  //  EFFECT PARA BUSCAR CEP AUTOMATICAMENTE
  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      const timeoutId = setTimeout(() => {
        buscarCep(cepLimpo);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else if (cepLimpo.length > 0 && cepLimpo.length < 8) {
      setCepValido(false);
    } else {
      setCepValido(null);
    }
  }, [cep]);

  //  FUNÇÃO PARA VALIDAR CEP MANUALMENTE
  const validarCep = (cepValue) => {
    const cepLimpo = cepValue.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return false;
    }

    if (/^(\d)\1{7}$/.test(cepLimpo)) {
      return false;
    }

    return true;
  };

  // FUNÇÃO PARA FECHAR PEDIDO COM OS DADOS DO MODAL
  const fecharPedidoComDados = async (e) => {
    e.preventDefault();

    // Validações básicas
    if (!carrinhoAtual) {
      Swal.fire({
        title: 'Erro!',
        text: 'Nenhum carrinho encontrado para finalizar.',
        icon: 'error',
        confirmButtonColor: '#84644D'
      });
      return;
    }

    if (!itens || itens.length === 0) {
      Swal.fire({
        title: 'Carrinho vazio!',
        text: 'Adicione produtos ao carrinho antes de finalizar o pedido.',
        icon: 'warning',
        confirmButtonColor: '#84644D'
      });
      return;
    }

    //  VALIDAÇÃO ESPECÍFICA DO CEP
    if (!cep || !validarCep(cep)) {
      Swal.fire({
        title: 'CEP inválido!',
        text: 'Por favor, informe um CEP válido com 8 dígitos.',
        icon: 'warning',
        confirmButtonColor: '#84644D'
      });
      return;
    }

    if (cepValido === false) {
      Swal.fire({
        title: 'CEP não encontrado!',
        text: 'O CEP informado não foi encontrado. Verifique e tente novamente.',
        icon: 'warning',
        confirmButtonColor: '#84644D'
      });
      return;
    }

    // Validar campos obrigatórios
    if (!estado || !cidade || !bairro || !logradouro || !nomeDestinatario || !numeroResidencia || !telefone) {
      Swal.fire({
        title: 'Campos obrigatórios!',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        icon: 'warning',
        confirmButtonColor: '#84644D'
      });
      return;
    }

    // Confirmação
    const result = await Swal.fire({
      title: 'Confirmar pedido?',
      html: `
        <div style="text-align: left; margin: 10px 0;">
          <p><strong>Destinatário:</strong> ${nomeDestinatario}</p>
          <p><strong>Endereço:</strong> ${logradouro}, ${numeroResidencia}</p>
          <p><strong>Bairro:</strong> ${bairro} - ${cidade}/${estado}</p>
          <p><strong>CEP:</strong> ${cep}</p>
          <p><strong>Telefone:</strong> ${telefone}</p>
          <hr style="margin: 15px 0;">
          <p><strong>Total:</strong> R$ ${subtotal?.toFixed(2) || '0.00'}</p>
          <p><strong>Itens:</strong> ${itens?.length || 0} produto(s)</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#84644D',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmar Pedido',
      cancelButtonText: 'Revisar',
      customClass: {
        popup: 'swal-wide'
      }
    });

    if (result.isConfirmed) {
      try {
        setFinalizandoPedido(true);

        // DADOS DE ENTREGA
        const dadosPedido = {
          endereco_entrega: {
            cep: cep.replace(/\D/g, ''),
            uf: estado,
            cidade: cidade,
            bairro: bairro,
            logradouro: logradouro,
            numero_residencia: numeroResidencia,
            complemento: complemento || null,
            nome_destinatario: nomeDestinatario,
            telefone_contato: telefone.replace(/\D/g, '')
          },
          observacoes: observacoes || null
        };

        console.log('Finalizando pedido com dados:', dadosPedido);

        const resposta = await finalizarCarrinho(carrinhoAtual.id_carrinho || carrinhoAtual.id, dadosPedido);

        // Sucesso
        await Swal.fire({
          title: 'Pedido realizado com sucesso! 🎉',
          html: `
            <div style="text-align: center; margin: 20px 0;">
              <p style="font-size: 18px; color: #28a745; margin-bottom: 15px;">
                <strong>ID do Pedido: #${resposta.pedido?.id_pedido}</strong>
              </p>
              <p>Seu pedido foi enviado para produção!</p>
              <p style="color: #666; font-size: 14px; margin-top: 15px;">
                Você pode acompanhar o status na área "Meus Pedidos"
              </p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#84644D',
          confirmButtonText: 'Ver Meus Pedidos',
          showCancelButton: true,
          cancelButtonText: 'Fechar',
          cancelButtonColor: '#6c757d'
        });

        // Limpar formulário
        setCep('');
        setEstado('');
        setCidade('');
        setBairro('');
        setLogradouro('');
        setNomeDestinatario('');
        setNumeroResidencia('');
        setComplemento('');
        setTelefone('');
        setObservacoes('');

        // Callback para o componente pai
        if (onPedidoFinalizado) {
          onPedidoFinalizado();
        }

      } catch (error) {
        console.error('Erro ao finalizar carrinho:', error);

        Swal.fire({
          title: 'Erro ao finalizar pedido',
          html: `
            <p>Não foi possível finalizar seu pedido.</p>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              <strong>Erro:</strong> ${error.message || 'Erro interno do servidor'}
            </p>
          `,
          icon: 'error',
          confirmButtonColor: '#84644D',
          confirmButtonText: 'Tentar Novamente'
        });
      } finally {
        setFinalizandoPedido(false);
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="overlay-entrega">
      <div className="container-entrega">

        {/* Cabeçalho do Modal*/}
        <div className="header-entrega">
          <IoLocationSharp className='icon-location' />
          <h2 className="title-entrega">Dados para entrega</h2>
          <CgCloseO className="entrega-close" onClick={() => setIsOpen(false)} />
        </div>

        {/* RESUMO DO PEDIDO*/}
        <div className="resumo-pedido">
          <h3>Resumo do Pedido</h3>
          <div className="resumo-info">
            <span>Total: <strong>R$ {subtotal?.toFixed(2) || '0.00'}</strong></span>
            <span>{itens?.length || 0} item(s)</span>
          </div>
        </div>

        {/* FORM COM onSubmit*/}
        <form className="form-entrega" onSubmit={fecharPedidoComDados}>

          {/* Coluna Esquerda*/}
          <div className="column-entrega">
            <label htmlFor="cep">
              CEP*
              {/* {buscandoCep && <span className="loading-text">Buscando...</span>}
              {cepValido === true && <span className="success-text">Válido</span>}
              {cepValido === false && <span className="error-text">Inválido</span>} */}
            </label>
            <InputMask
              type="text"
              id="cep"
              name="cep"
              className={`input-entrega ${cepValido === true ? 'input-success' :
                  cepValido === false ? 'input-error' : ''
                }`}
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              mask="99999-999"
              maskChar="_"
              placeholder="00000-000"
              required
            />

            <label htmlFor="estado">Estado (UF)*</label>
            <select
              id="estado"
              name="estado"
              className="input-entrega"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
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

            <label htmlFor="cidade">Cidade*</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              className="input-entrega"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="São Paulo"
              required
            />

            <label htmlFor="bairro">Bairro*</label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              className="input-entrega"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Centro"
              required
            />

            <label htmlFor="logradouro">Logradouro (Rua / Avenida)*</label>
            <input
              type="text"
              id="logradouro"
              name="logradouro"
              className="input-entrega"
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
              placeholder="Rua das Flores"
              required
            />
          </div>

          {/* Coluna Direita*/}
          <div className="column-entrega">
            <label htmlFor="nome-destinatario">Nome completo do destinatário*</label>
            <input
              type="text"
              id="nome-destinatario"
              name="nome-destinatario"
              className="input-entrega"
              value={nomeDestinatario}
              onChange={(e) => setNomeDestinatario(e.target.value)}
              placeholder="João da Silva"
              required
            />

            <label htmlFor="numero-residencia">Número da residência*</label>
            <input
              type="text"
              id="numero-residencia"
              name="numero-residencia"
              className="input-entrega"
              value={numeroResidencia}
              onChange={(e) => setNumeroResidencia(e.target.value)}
              placeholder="123"
              required
            />

            <label htmlFor="complemento">Complemento (opcional)</label>
            <input
              type="text"
              id="complemento"
              name="complemento"
              className="input-entrega"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              placeholder="Apt 45, Bloco B"
            />

            <label htmlFor="telefone">Telefone / WhatsApp*</label>
            <InputMask
              type="tel"
              id="telefone"
              name="telefone"
              className="input-entrega"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              mask="(99) 99999-9999"
              maskChar='_'
              placeholder="(11) 99999-9999"
              required
            />

            <label htmlFor="observacoes">Observações para o entregador (opcional)</label>
            <textarea
              id="observacoes"
              name="observacoes"
              className="input-entrega textarea-entrega"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Instruções especiais para entrega..."
              rows="3"
            />
          </div>

        </form>

        {/* BOTÕES */}
        <div className="botoes-entrega">
          <button
            type="submit"
            className="button-confirm"
            onClick={fecharPedidoComDados}
            disabled={finalizandoPedido || buscandoCep}
          >
            {finalizandoPedido ? (
              <>
                <span className="spinner-small"></span>
                Finalizando pedido...
              </>
            ) : buscandoCep ? (
              <>
                <span className="spinner-small"></span>
                Validando CEP...
              </>
            ) : (
              'Finalizar Pedido'
            )}
          </button>
          <button
            type="button"
            className="button-back"
            onClick={() => setIsOpen(false)}
            disabled={finalizandoPedido || buscandoCep}
          >
            Voltar
          </button>
        </div>


      </div>
    </div>
  )
}

export default ModalDadosEntrega