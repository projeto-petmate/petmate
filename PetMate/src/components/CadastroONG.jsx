import React, { useEffect } from 'react'
import { useState } from 'react'
import "./cadastroONG.css"
import { Link, useNavigate } from "react-router-dom";
import { addOng } from '../apiService';
import { FaUserCircle } from "react-icons/fa";

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
  const [ongFoto, setOngFoto] = useState('')
  const [ongImagemPreview, setOngImagemPreview] = useState(null)
  const [erros, setErros] = useState({})
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
      navigate('/Login'); // Use the navigate function to redirect
    }
    catch (error) {
      console.error('Erro ao cadastrar ONG:', error);
      setErros({ email: 'Email já cadastrado' });
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData((prevData) => ({ ...prevData, imagem: reader.result }));
      setImagemPreviewPerfil(reader.result);
    };
    reader.readAsDataURL(file);
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

          {imagemPreviewPerfil === null ?
            <FaUserCircle className='user-icon' onClick={() => document.getElementById('file-upload').click()} /> :
            <div className="img-preview-perfil" >
              {imagemPreviewPerfil && (
                <img src={imagemPreviewPerfil} alt="Pré-visualização" className="imagem-preview-perfil" />
              )}
            </div>
          }
        </div>

        <form className="forms-cad-ong" action="">
          <div className="inputs-cad-ong">
            <div className="coluna-1-inputs"></div>
            <div className="coluna-1-inputs">
              <label htmlFor="">Nome:</label>
              <input className="input-cad-ong" type="text"
                value={ongNome}
                onChange={(e) => setOngNome(e.target.value)} />
              <label htmlFor="">Email:</label>
              <input className="input-cad-ong" type="text"
                value={ongEmail}
                onChange={(e) => setOngEmail(e.target.value)}
              />
              <label htmlFor="">Senha:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongSenha}
                onChange={(e) => setOngSenha(e.target.value)}
              />
              <label htmlFor="">Telefone:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongTelefone}
                onChange={(e) => setOngTelefone(e.target.value)}
              />
              <label htmlFor="">Telefone Denúncia:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongTelefoneDenuncia}
                onChange={(e) => setOngTelefoneDenuncia(e.target.value)}
              />
            </div>

            <div className="coluna-2-inputs">
              <label htmlFor="">Cnpj Ong:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongCnpj}
                onChange={(e) => setOngCnpj(e.target.value)}
              />
              <label htmlFor="">Nome do responsavel:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongNomeResponsavel}
                onChange={(e) => setOngNomeResponsavel(e.target.value)}
              />
              <label htmlFor="">Cpf do responsavel:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongCpfResponsavel}
                onChange={(e) => setOngCpfResponsavel(e.target.value)}
              />
              <label htmlFor="">Data de nascimento do responsavel:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongDataNascimentoResponsavel}
                onChange={(e) => setOngDataNascimentoResponsavel(e.target.value)}
              />
              <label htmlFor="">Email do responsavel:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongEmailResponsavel}
                onChange={(e) => setOngEmailResponsavel(e.target.value)}
              />
            </div>

            <div className="coluna-3-inputs">
              <label htmlFor="">Telefone do responsavel:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongTelefoneResponsavel}
                onChange={(e) => setOngTelefoneResponsavel(e.target.value)}
              />
              <label htmlFor="">Estado:
              </label>
              <select className="input-cad-ong"
                value={ongEstado}
                onChange={(e) => setOngEstado(e.target.value)}
              >
                <option value="">Escolha seu estado</option>
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
              <label htmlFor="">Cidade:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongCidade}
                onChange={(e) => setOngCidade(e.target.value)}
              />
              <label htmlFor="">Endereço:
              </label>
              <input className="input-cad-ong" type="text"
                value={ongEndereco}
                onChange={(e) => setOngEndereco(e.target.value)}
              />
              <label htmlFor="">Confirmar senha:
              </label>
              <input className="input-cad-ong" type="text"
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

      <div className="img-lateral">
        <img src="" alt="" />
      </div>
    </div>
  )
}

export default CadastroONG
