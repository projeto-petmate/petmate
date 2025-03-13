import React, { useEffect } from 'react'
import { useState } from 'react'
import "./cadastroONG.css"
import { Link, useNavigate } from "react-router-dom";
import { addOng } from '../apiService';

function CadastroONG() {
  const navigate = useNavigate(); // Use the hook to get the navigate function

  const [ongNome, setOngNome] = useState('')
  const [ongEmail, setOngEmail] = useState('')
  const [ongSenha, setOngSenha] = useState('')
  const [ongTelefone, setOngTelefone] = useState('')
  const [ongTelefoneDenuncia, setOngTelefoneDenuncia] = useState('')
  const [ongCnpj, setOngCnpj] = useState('')
  const [ongNomeResponsavel, setOngNomeResponsavel] = useState('')
  const [ongCpfResponsavel, setOngCpfResponsavel] = useState('')
  const [ongDataNascimentoResponsavel, setOngDataNascimentoResponsavel] = useState('')
  const [ongEmailResponsavel, setOngEmailResponsavel] = useState('')
  const [ongTelefoneResponsavel, setOngTelefoneResponsavel] = useState('')
  const [ongEstado, setOngEstado] = useState('')
  const [ongCidade, setOngCidade] = useState('')
  const [ongEndereco, setOngEndereco] = useState('')
  const [ongDescricao, setOngDescricao] = useState('')
  const [ongFoto, setOngFoto] = useState('')
  const [ongImagemPreview, setOngImagemPreview] = useState(null)
  const [erros, setErros] = useState({})

  const validarFormulario = () => {
    const erros = {}
    if (!ongNome) erros.nome_ong = 'Nome é obrigatório'
    if (!ongEmail) erros.email = 'Email é obrigatório'
    if (!ongSenha) erros.senha = 'Senha é obrigatória'
    if (!ongTelefone) erros.telefone = 'Telefone é obrigatório'
    if (!ongCnpj) erros.cnpj = 'CNPJ é obrigatório'
    if (!ongNomeResponsavel) erros.nome_responsavel = 'Nome do responsável é obrigatório'
    if (!ongCpfResponsavel) erros.cpf_responsavel = 'CPF do responsável é obrigatório'
    if (!ongDataNascimentoResponsavel) erros.data_nascimento_responsavel = 'Data de nascimento do responsável é obrigatória'
    if (!ongEmailResponsavel) erros.email_responsavel = 'Email do responsável é obrigatório'
    if (!ongTelefoneResponsavel) erros.telefone_responsavel = 'Telefone do responsável é obrigatório'
    if (!ongEstado) erros.estado_ong = 'Estado é obrigatório'
    if (!ongCidade) erros.cidade_ong = 'Cidade é obrigatória'
    if (!ongEndereco) erros.endereco_ong = 'Endereço é obrigatório'
    if (!ongDescricao) erros.descricao_ong = 'Descrição é obrigatória'
    if (!ongFoto) erros.foto_ong = 'Foto é obrigatória'
    return erros
  }

  const cadastrarOng = async (e) => {
    e.preventDefault()

    const errosValidacao = validarFormulario()
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao)
      return
    }

    const novaOng = {
       nome_ong: ongNome,
       email: ongEmail,
       senha: ongSenha,
       telefone: ongTelefone,
       telefone_denuncia: ongTelefoneDenuncia,
       cnpj: ongCnpj,
       nome_responsavel: ongNomeResponsavel,
       cpf_responsavel: ongCpfResponsavel,
       data_nascimento_responsavel: ongDataNascimentoResponsavel,
       email_responsavel: ongEmailResponsavel,
       telefone_responsavel: ongTelefoneResponsavel,
       estado_ong: ongEstado,
       cidade_ong: ongCidade,
       endereco_ong: ongEndereco,
       foto_ong: ongFoto,
       descricao_ong: ongDescricao
    };

    console.log('Dados enviados para o servidor:', novaOng);

    try { 
      await addOng(novaOng);
      console.log('Ong cadastrada com sucesso!', novaOng);
      navigate('/Login'); // Use the navigate function to redirect
    }
    catch (error) {
      console.error('Erro ao cadastrar ONG:', error);
      setErros({ email: 'Email já cadastrado' });
    }
  }

  return (
    <div className="conteiner-cad-ong">
      <div className="conteiner-info-ong">
        <div className="texto-cadastro-ong">
          <Link to="/Cadastro">
            <button className="botao-voltar-cad">X</button>
          </Link>
          <div className="texto-cadastro-ong-img">
            <h2>Cadastro ONG</h2>
            <img className="barra-cad-ong" src="/images/barra_marrom.png" alt="" />
          </div>
        </div>

        <div className="ong-foto">
          <label htmlFor="">Coloque a logo ou foto de sua ong
            <input type="file" 
            value={ongFoto}
            onChange={(e) => setOngFoto(e.target.value)}/>
          </label>
        </div>
        <form className="forms-cad-ong" action="">
          <div className="inputs-cad-ong">
            <div className="coluna-1-inputs"></div>
            <div className="coluna-1-inputs">
              <label htmlFor="">Nome</label>
              <input className="input-cad-ong" type="text"
                value={ongNome}
                onChange={(e) => setOngNome(e.target.value)} />
              <label htmlFor="">Email</label>
              <input className="input-cad-ong" type="text"
                value={ongEmail}
                onChange={(e) => setOngEmail(e.target.value)}
              />
              <label htmlFor="">Senha
              </label>
              <input className="input-cad-ong" type="text"
                value={ongSenha}
                onChange={(e) => setOngSenha(e.target.value)}
              />
              <label htmlFor="">Telefone
              </label>
              <input className="input-cad-ong" type="text"
                value={ongTelefone}
                onChange={(e) => setOngTelefone(e.target.value)}
              />
              <label htmlFor="">Telefone Denúncia
              </label>
              <input className="input-cad-ong" type="text"
                value={ongTelefoneDenuncia}
                onChange={(e) => setOngTelefoneDenuncia(e.target.value)}
              />
            </div>

            <div className="coluna-2-inputs">
              <label htmlFor="">Cnpj Ong
              </label>
              <input className="input-cad-ong" type="text"
                value={ongCnpj}
                onChange={(e) => setOngCnpj(e.target.value)}
              />
              <label htmlFor="">Nome do responsavel
              </label>
              <input className="input-cad-ong" type="text"
                value={ongNomeResponsavel}
                onChange={(e) => setOngNomeResponsavel(e.target.value)}
              />
              <label htmlFor="">Cpf do responsavel
              </label>
              <input className="input-cad-ong" type="text"
                value={ongCpfResponsavel}
                onChange={(e) => setOngCpfResponsavel(e.target.value)}
              />
              <label htmlFor="">Data de nascimento do responsavel
              </label>
              <input className="input-cad-ong" type="text"
                value={ongDataNascimentoResponsavel}
                onChange={(e) => setOngDataNascimentoResponsavel(e.target.value)}
              />
              <label htmlFor="">Email do responsavel
              </label>
              <input className="input-cad-ong" type="text"
                value={ongEmailResponsavel}
                onChange={(e) => setOngEmailResponsavel(e.target.value)}
              />
            </div>

            <div className="coluna-3-inputs">
              <label htmlFor="">Telefone do responsavel
              </label>
              <input className="input-cad-ong" type="text"
                value={ongTelefoneResponsavel}
                onChange={(e) => setOngTelefoneResponsavel(e.target.value)}
              />
              <label htmlFor="">Estado onde se encontra a ONG
              </label>
              <input className="input-cad-ong" type="text"
                value={ongEstado}
                onChange={(e) => setOngEstado(e.target.value)}
              />
              <label htmlFor="">Cidade onde se encontra a ONG
              </label>
              <input className="input-cad-ong" type="text"
                value={ongCidade}
                onChange={(e) => setOngCidade(e.target.value)}
              />
              <label htmlFor="">Endereço da ONG
              </label>
              <input className="input-cad-ong" type="text"
                value={ongEndereco}
                onChange={(e) => setOngEndereco(e.target.value)}
              />
            </div>
          </div>
        <div className="descricao-ong">
          <label htmlFor="">Descrição da ONG
          </label>
          <input className="input-descricao-cad-ong" type="text"
            value={ongDescricao}
            onChange={(e) => setOngDescricao(e.target.value)}
            />
        </div>
        <div className="termos-ong">
          <p>termos</p>
        </div>
        <div className="conteiner-botao-cad-ong">
          <button type="submit" className="botao-cad-ong" onClick={cadastrarOng}>Cadastrar</button>
        </div>
            </form>
      </div>

      <div className="img-lateral">
        <img src="" alt="" />
      </div>
    </div>
  )
}

export default CadastroONG
