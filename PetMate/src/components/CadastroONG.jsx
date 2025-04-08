import React, { useEffect } from 'react'
import { useState } from 'react'
import "./cadastroONG.css"
import { Link, useNavigate } from "react-router-dom";
import { addOng } from '../apiService';
import { FaUserCircle } from "react-icons/fa";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaPhoneAlt,
  FaIdCard,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCity,
  FaHome
} from "react-icons/fa";

function CadastroONG() {
  const navigate = useNavigate();

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
  const [ongFoto, setOngFoto] = useState('')
  const [erros, setErros] = useState({})
  const [ongImagemPreview, setOngImagemPreview] = useState(null)
  const [imagemPreviewPerfil, setImagemPreviewPerfil] = useState(null);

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
      foto_ong: ongFoto
    };

    console.log('Dados enviados para o servidor:', novaOng);

    try {
      await addOng(novaOng);
      console.log('Ong cadastrada com sucesso!', novaOng);
      navigate('/Login');
    }
    catch (error) {
      console.error('Erro ao cadastrar ONG:', error);
      setErros({ email: 'Email já cadastrado' });
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setOngFoto(reader.result)
      setImagemPreviewPerfil(reader.result)
    }
    reader.readAsDataURL(file)
  };

  return (
    <div className="conteiner-cad-ong">
      <div className="conteiner-info-ong">
        <div className="top-cad-ong">
          <div className="texto-cadastro-ong">
            <div className="texto-cadastro-ong-img">
              <h2>Cadastro de ONG</h2>
              <img className="barra-cad-ong" src="/images/barra_marrom.png" alt="" />
            </div>
            <img className='logoMarrom-cad-ong' src="/images/logoMarrom.svg" alt="" />

          </div>
        </div>

        <div className="user-icon-container-ong">
          <div className="add-img">
            <input
              id="file-upload"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {imagemPreviewPerfil === null ? (
            <FaUserCircle
              className="user-icon"
              onClick={() => document.getElementById('file-upload').click()}
            />
          ) : (
            <div
              className="img-preview-perfil"
              onClick={() => document.getElementById('file-upload').click()} /* Permite clicar na imagem */
            >
              {imagemPreviewPerfil && (
                <img
                  src={imagemPreviewPerfil}
                  alt="Pré-visualização"
                  className="imagem-preview-perfil"
                />
              )}
            </div>
          )}

          <p style={{ marginTop: '10px', marginBottom: '10px', fontSize: '17px' }}>
            Clique aqui e coloque sua foto de perfil
          </p>
        </div>
        <form className="forms-cad-ong" action="">
          <div className="inputs-cad-ong">
            <div className="coluna-1-inputs">
              <label htmlFor="ongNome">
                <div className="icon-input-ong">
                  <FaUser className="icon-cadastro" />
                  <p>Nome:</p>
                </div>
              </label>
              <input
                id="ongNome"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o nome da ONG"
                value={ongNome}
                onChange={(e) => setOngNome(e.target.value)}
              />

              <label htmlFor="ongEmail">
                <div className="icon-input-ong">
                  <FaEnvelope className="icon-cadastro" />
                  <p>Email:</p>
                </div>
              </label>
              <input
                id="ongEmail"
                className="input-cad-ong"
                type="email"
                placeholder="Digite o email da ONG"
                value={ongEmail}
                onChange={(e) => setOngEmail(e.target.value)}
              />
              <label htmlFor="ongCnpj">
                <div className="icon-input-ong">
                  <FaIdCard className="icon-cadastro" />
                  <p>CNPJ da ONG:</p>
                </div>
              </label>
              <input
                id="ongCnpj"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o CNPJ da ONG"
                value={ongCnpj}
                onChange={(e) => setOngCnpj(e.target.value)}
              />


              <label htmlFor="ongTelefone">
                <div className="icon-input-ong">
                  <FaPhoneAlt className="icon-cadastro" />
                  <p>Telefone:</p>
                </div>
              </label>
              <input
                id="ongTelefone"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o telefone da ONG"
                value={ongTelefone}
                onChange={(e) => setOngTelefone(e.target.value)}
              />

              <label htmlFor="ongTelefoneDenuncia">
                <div className="icon-input-ong">
                  <FaPhoneAlt className="icon-cadastro" />
                  <p>Telefone de Denúncia (opcional):</p>
                </div>
              </label>
              <input
                id="ongTelefoneDenuncia"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o telefone para denúncias"
                value={ongTelefoneDenuncia}
                onChange={(e) => setOngTelefoneDenuncia(e.target.value)}
              />
            </div>

            <div className="coluna-2-inputs">
              <label htmlFor="ongTelefoneResponsavel">
                <div className="icon-input-ong">
                  <FaPhoneAlt className="icon-cadastro" />
                  <p>Telefone do responsável:</p>
                </div>
              </label>
              <input
                id="ongTelefoneResponsavel"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o telefone do responsável"
                value={ongTelefoneResponsavel}
                onChange={(e) => setOngTelefoneResponsavel(e.target.value)}
              />

              <label htmlFor="ongNomeResponsavel">
                <div className="icon-input-ong">
                  <FaUser className="icon-cadastro" />
                  <p>Nome do responsável:</p>
                </div>
              </label>
              <input
                id="ongNomeResponsavel"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o nome do responsável"
                value={ongNomeResponsavel}
                onChange={(e) => setOngNomeResponsavel(e.target.value)}
              />

              <label htmlFor="ongCpfResponsavel">
                <div className="icon-input-ong">
                  <FaIdCard className="icon-cadastro" />
                  <p>CPF do responsável:</p>
                </div>
              </label>
              <input
                id="ongCpfResponsavel"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o CPF do responsável"
                value={ongCpfResponsavel}
                onChange={(e) => setOngCpfResponsavel(e.target.value)}
              />

              <label htmlFor="ongDataNascimentoResponsavel">
                <div className="icon-input-ong">
                  <FaCalendarAlt className="icon-cadastro" />
                  <p>Data de nascimento do responsável:</p>
                </div>
              </label>
              <input
                id="ongDataNascimentoResponsavel"
                className="input-cad-ong"
                type="date"
                placeholder="Selecione a data de nascimento"
                value={ongDataNascimentoResponsavel}
                onChange={(e) => setOngDataNascimentoResponsavel(e.target.value)}
              />

              <label htmlFor="ongEmailResponsavel">
                <div className="icon-input-ong">
                  <FaEnvelope className="icon-cadastro" />
                  <p>Email do responsável:</p>
                </div>
              </label>
              <input
                id="ongEmailResponsavel"
                className="input-cad-ong"
                type="email"
                placeholder="Digite o email do responsável"
                value={ongEmailResponsavel}
                onChange={(e) => setOngEmailResponsavel(e.target.value)}
              />
            </div>

            <div className="coluna-3-inputs">

              <label htmlFor="ongEstado">
                <div className="icon-input-ong">
                  <FaMapMarkerAlt className="icon-cadastro" />
                  <p>Estado:</p>
                </div>
              </label>
              <select
                id="ongEstado"
                className="select-estado"
                value={ongEstado}
                onChange={(e) => setOngEstado(e.target.value)}
              >
                <option value="" disabled>
                  Selecione o estado
                </option>
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

              <label htmlFor="ongCidade">
                <div className="icon-input-ong">
                  <FaCity className="icon-cadastro" />
                  <p>Cidade:</p>
                </div>
              </label>
              <input
                id="ongCidade"
                className="input-cad-ong"
                type="text"
                placeholder="Digite a cidade"
                value={ongCidade}
                onChange={(e) => setOngCidade(e.target.value)}
              />

              <label htmlFor="ongEndereco">
                <div className="icon-input-ong">
                  <FaHome className="icon-cadastro" />
                  <p>Endereço:</p>
                </div>
              </label>
              <input
                id="ongEndereco"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o endereço"
                value={ongEndereco}
                onChange={(e) => setOngEndereco(e.target.value)}
              />

              <label htmlFor="ongSenha">
                <div className="icon-input-ong">
                  <FaLock className="icon-cadastro" />
                  <p>Senha:</p>
                </div>
              </label>
              <input
                id="ongSenha"
                className="input-cad-ong"
                type="password"
                placeholder="Digite a senha"
                value={ongSenha}
                onChange={(e) => setOngSenha(e.target.value)}
              />

              <label htmlFor="ongConfirmarSenha">
                <div className="icon-input-ong">
                  <FaLock className="icon-cadastro" />
                  <p>Confirmar senha:</p>
                </div>
              </label>
              <input
                id="ongConfirmarSenha"
                className="input-cad-ong"
                type="password"
                placeholder="Confirme sua senha"
              />
            </div>
          </div>
          <div className="termos-ong">
            <p>Ao preencher o formuário acima  você concorda com os nossos Termos de Uso e nossa Política de Privacidade.</p>
          </div>
          <div className="conteiner-botao-cad-ong">
            <button type="submit" className="botao-cad-ong" onClick={cadastrarOng}>Cadastrar</button>
            <div className='login-cad-ong'>
              <p>Já possui conta?</p> <a href="/login"><p>Login</p></a>
            </div>
          </div>
        </form>
      </div>

      <div className="img-lateral-ong">
        <img src="./images/dog_ong.svg" alt="cachorro do cadastro de ongs" className='dog-ong' />
      </div>
    </div>
  )
}

export default CadastroONG
