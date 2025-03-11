import React, { useEffect } from 'react'
import { useState } from 'react'
import "./cadastroONG.css"
import { Link, useNavigate } from "react-router-dom";

function CadastroONG() {

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

 function cadastrarOng() {

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

        <img src="" alt="" />
      </div>

      <div className="inputs-cad-ong">
        <form className="forms-cad-ong" action="">

          <div className="coluna-1-inputs">
            <label htmlFor="">Nome
              <input className="input-cad-ong" type="text" 
              value={ongNome}
              onChange={(e) => setOngNome(e.target.value)}/>
            </label>
            <label htmlFor="">Email
              <input className="input-cad-ong" type="text"    
              value={ongEmail}
              onChange={(e) => setOngEmail(e.target.value)}
              />
            </label>
            <label htmlFor="">Senha
              <input className="input-cad-ong" type="text" 
              value={ongSenha}
              onChange={(e) => setOngSenha(e.target.value)}
              />
            </label>
            <label htmlFor="">Telefone
              <input className="input-cad-ong" type="text" 
              value={ongTelefone}
              onChange={(e) => setOngTelefone(e.target.value)}
              />
            </label>
            <label htmlFor="">Telefone Denúncia
              <input className="input-cad-ong" type="text" 
              value={ongTelefoneDenuncia}
              onChange={(e) => setOngTelefoneDenuncia(e.target.value)}
              />
            </label>
          </div>

          <div className="coluna-2-inputs">
            <label htmlFor="">Cnpj Ong
              <input className="input-cad-ong" type="text" 
              value={ongCnpj}
              onChange={(e) => setOngCnpj(e.target.value)}
              />
            </label>
            <label htmlFor="">Nome do responsavel
              <input className="input-cad-ong" type="text" 
              value={ongNomeResponsavel}
              onChange={(e) => setOngNomeResponsavel(e.target.value)}
              />
            </label>
            <label htmlFor="">Cpf do responsavel
              <input className="input-cad-ong" type="text" 
              value={ongCpfResponsavel}
              onChange={(e) => setOngCpfResponsavel(e.target.value)}
              />
            </label>
            <label htmlFor="">Data de nascimento do responsavel
              <input className="input-cad-ong" type="date" 
              value={ongDataNascimentoResponsavel}
              onChange={(e) => setOngDataNascimentoResponsavel(e.target.value)}
              />
            </label>
            <label htmlFor="">Email do responsavel
              <input className="input-cad-ong" type="text" 
              value={ongEmailResponsavel}
              onChange={(e) => setOngEmailResponsavel(e.target.value)}
              />
            </label>
          </div>

          <div className="coluna-3-inputs">
            <label htmlFor="">Telefone do responsavel
              <input className="input-cad-ong" type="text" 
              value={ongTelefoneResponsavel}
              onChange={(e) => setOngTelefoneResponsavel(e.target.value)}
              />
            </label>
            <label htmlFor="">Estado onde se encontra a ONG
              <input className="input-cad-ong" type="text" 
              value={ongEstado}
              onChange={(e) => setOngEstado(e.target.value)}
              />
            </label>
            <label htmlFor="">Cidade onde se encontra a ONG
              <input className="input-cad-ong" type="text" 
              value={ongCidade}
              onChange={(e) => setOngCidade(e.target.value)}
              />
            </label>
            <label htmlFor="">Endereço da ONG
              <input className="input-cad-ong" type="text" 
              value={ongEndereco}
              onChange={(e) => setOngEndereco(e.target.value)}
              />
            </label>
          </div>
        </form>
      </div>
            <div className="descricao-ong">
            <label htmlFor="">Descrição da ONG
              <input className="input-cad-ong" type="text" 
              value={ongDescricao}
              onChange={(e) => setOngDescricao(e.target.value)}
              />
            </label>
            </div>
            <div className="termos-ong">
              <p>termos</p>
            </div>
            <div className="conteiner-botao-cad-ong">
              <button className="botao-cad-ong" onClick={cadastrarOng}>Cadastrar</button>
            </div>
      </div>


      <div className="img-lateral">
        <img src="" alt="" />
      </div>


    </div>
  )
}

export default CadastroONG
