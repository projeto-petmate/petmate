import React, { useState } from 'react';
import "./cadastroONG.css";
import { useNavigate } from "react-router-dom";
import { addOng, getUserByEmail, verificarCpnjUnico } from '../apiService';
import { FaInfoCircle, FaTrash, FaUserCircle } from "react-icons/fa";
import { cpf, cnpj } from 'cpf-cnpj-validator';
import Swal from 'sweetalert2';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaIdCard,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCity,
  FaHome
} from "react-icons/fa";
import { BiLogoInstagramAlt } from 'react-icons/bi';

function CadastroONG() {
  const navigate = useNavigate();

  const [ongNome, setOngNome] = useState('');
  const [ongEmail, setOngEmail] = useState('');
  const [ongSenha, setOngSenha] = useState('');
  const [ongConfirmarSenha, setOngConfirmarSenha] = useState('');
  const [ongTelefone, setOngTelefone] = useState('');
  const [ongCnpj, setOngCnpj] = useState('');
  const [ongNomeResponsavel, setOngNomeResponsavel] = useState('');
  const [ongCpfResponsavel, setOngCpfResponsavel] = useState('');
  const [ongDataNascimentoResponsavel, setOngDataNascimentoResponsavel] = useState('');
  const [ongEmailContato, setOngEmailContato] = useState('');
  const [ongTelefoneResponsavel, setOngTelefoneResponsavel] = useState('');
  const [ongEstado, setOngEstado] = useState('');
  const [ongCidade, setOngCidade] = useState('');
  const [ongEndereco, setOngEndereco] = useState('');
  const [ongFoto, setOngFoto] = useState('');
  const [ongInstagram, setOngInstagram] = useState('');
  const [ongDescricao, setOngDescricao] = useState('');
  const [erros, setErros] = useState({});
  const [imagemPreviewPerfil, setImagemPreviewPerfil] = useState(null);

  const calcularIdade = (dataNascimento) => {
    const [ano, mes, dia] = dataNascimento.split('-');
    const hoje = new Date();
    const nascimento = new Date(ano, mes - 1, dia);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth() - nascimento.getMonth();
    if (mesAtual < 0 || (mesAtual === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const validarFormulario = async () => {
    const novosErros = {};

    // Validação do nome da ONG
    if (!ongNome) {
      novosErros.nome_ong = 'O nome da ONG é obrigatório.';
    } else if (ongNome.length < 6) {
      novosErros.nome_ong = 'O nome da ONG deve ter pelo menos 6 caracteres.';
    }

    // Validação do email
    if (!ongEmail) {
      novosErros.email = 'O email é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ongEmail)) {
      novosErros.email = 'O email não é válido.';
    } else {
      try {
        const emailExiste = await getUserByEmail(ongEmail.toLowerCase());
        if (emailExiste) {
          novosErros.email = 'Este email já está em uso.';
        }
      } catch (error) {
        console.error('Erro ao verificar email:', error);
      }
    }

    // Validação da senha
    if (!ongSenha) {
      novosErros.senha = 'A senha é obrigatória.';
    } else if (ongSenha.length < 8) {
      novosErros.senha = 'A senha deve ter pelo menos 8 caracteres.';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(ongSenha)) {
      novosErros.senha = 'A senha deve conter pelo menos um caractere especial.';
    }
    // Validação da confirmação de senha
    else if (ongSenha !== ongConfirmarSenha) {
      novosErros.confirmar_senha = 'As senhas não coincidem.';
    }

    // Validação do telefone
    if (!ongTelefone) {
      novosErros.telefone = 'O telefone é obrigatório.';
    } else if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(ongTelefone)) {
      novosErros.telefone = 'O telefone deve estar no formato (XX) XXXXX-XXXX.';
    }

    // Validação do CNPJ
    if (!ongCnpj) {
      novosErros.cnpj = 'O CNPJ é obrigatório.';
    } else if (!cnpj.isValid(ongCnpj)) {
      novosErros.cnpj = 'O CNPJ é inválido.';
    } else {
      try {
        const cnpjExiste = await verificarCpnjUnico(ongCnpj);
        if (cnpjExiste) {
          novosErros.cnpj = 'Este CNPJ já está em uso.';
        }
      } catch (error) {
        console.error('Erro ao verificar CNPJ:', error);
      }
    }

    // Validação do nome do responsável
    if (!ongNomeResponsavel) {
      novosErros.nome_responsavel = 'O nome do responsável é obrigatório.';
    } else if (/[^a-zA-ZÀ-ÿ\s]/.test(ongNomeResponsavel)) {
      novosErros.nome_responsavel = 'O nome do responsável não pode conter caracteres especiais ou números.';
    }

    // Validação do CPF do responsável
    if (!ongCpfResponsavel) {
      novosErros.cpf_responsavel = 'O CPF do responsável é obrigatório.';
    } else if (!cpf.isValid(ongCpfResponsavel)) {
      novosErros.cpf_responsavel = 'O CPF do responsável é inválido.';
    }

    // Validação da data de nascimento do responsável
    if (!ongDataNascimentoResponsavel) {
      novosErros.data_nascimento_responsavel = 'A data de nascimento do responsável é obrigatória.';
    } else if (calcularIdade(ongDataNascimentoResponsavel) < 18) {
      novosErros.data_nascimento_responsavel = 'O responsável deve ter mais de 18 anos.';
    }

    // Validação do email do responsável
    if (!ongEmailContato) {
      novosErros.email_contato = 'O email de contato é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ongEmailContato)) {
      novosErros.email_contato = 'O email de contato não é válido.';
    }

    // Validação do telefone do responsável
    if (!ongTelefoneResponsavel) {
      novosErros.telefone_responsavel = 'O telefone do responsável é obrigatório.';
    } else if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(ongTelefoneResponsavel)) {
      novosErros.telefone_responsavel = 'O telefone do responsável deve estar no formato (XX) XXXXX-XXXX.';
    }

    // Validação do estado
    if (!ongEstado || ongEstado.length !== 2) {
      novosErros.estado_ong = 'O estado deve ter 2 caracteres.';
    }

    // Validação da cidade
    if (!ongCidade) {
      novosErros.cidade_ong = 'A cidade é obrigatória.';
    }

    // Validação do endereço
    if (!ongEndereco) {
      novosErros.endereco_ong = 'O endereço é obrigatório.';
    }

    // Validação da foto
    if (!ongFoto) {
      novosErros.foto_ong = 'A foto de perfil é obrigatória.';
    }

    if (Object.keys(novosErros).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: Object.values(novosErros)[0],
        confirmButtonColor: '#84644D',
      });
      return false;
    }

    // setErros(novosErros);
    // return Object.keys(novosErros).length === 0;
  };

  const cadastrarOng = async (e) => {
    
    e.preventDefault();

    const formularioValido = await validarFormulario();
    if (!formularioValido) return;

    const novaOng = {
      nome_ong: ongNome,
      email: ongEmail,
      senha: ongSenha,
      telefone: ongTelefone,
      instagram: ongInstagram,
      cnpj: ongCnpj,
      email_contato: ongEmailContato,
      nome_responsavel: ongNomeResponsavel,
      cpf_responsavel: ongCpfResponsavel,
      data_nascimento_responsavel: ongDataNascimentoResponsavel,
      telefone_responsavel: ongTelefoneResponsavel,
      estado: ongEstado,
      cidade: ongCidade,
      endereco: ongEndereco,
      foto_perfil: ongFoto,
      descricao: ongDescricao,
      tipo: 'ong',
      data_criacao: new Date().toISOString(),
    };

    try {
      await addOng(novaOng);
      console.log('Ong cadastrada com sucesso!', novaOng);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cadastro realizado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error('Erro ao cadastrar ONG:', error);
      setErros({ email: 'Email já cadastrado' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setOngFoto(reader.result);
      setImagemPreviewPerfil(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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
        <div className="container-icon-cad-ong">
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
                className="user-icon-ong"
                onClick={() => document.getElementById('file-upload').click()}
              />
            ) : (
              <div
                className="img-preview-perfil"
                onClick={() => document.getElementById('file-upload').click()}
              >
                {imagemPreviewPerfil && (
                  <img
                    src={imagemPreviewPerfil}
                    alt="Pré-visualização"
                    className="imagem-preview-ong"
                  />
                )}
              </div>
            )}
            <p style={{ marginTop: '10px', marginBottom: '10px', fontSize: '17px' }}>
              Clique aqui e adicione a foto de perfil da ONG.
            </p>
            {erros.foto_ong && <p className="erro-mensagem">{erros.foto_ong}</p>}

          </div>

          <div className="icon-trash-container-ong">
            {imagemPreviewPerfil && (
              <FaTrash
                className="icon-trash-cad-ong"
                onClick={() => {
                  setImagemPreviewPerfil(null);
                  setOngFoto('');
                  document.getElementById('file-upload').value = null;
                }}
                style={{ cursor: 'pointer' }}
              />
            )}
          </div>
        </div>
        <form className="forms-cad-ong" onSubmit={cadastrarOng}>
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
              {erros.nome_ong && <p className="erro-mensagem">{erros.nome_ong}</p>}

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
                onChange={(e) => setOngEmail(e.target.value.toLowerCase())}
              />
              {erros.email && <p className="erro-mensagem">{erros.email}</p>}

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
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  value = value.slice(0, 14);

                  const formattedValue = value
                    .replace(/(\d{2})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{4})$/, '$1/$2')
                    .replace(/(\d{4})(\d{2})$/, '$1-$2');

                  setOngCnpj(formattedValue);
                }}
              />
              {erros.cnpj && <p className="erro-mensagem">{erros.cnpj}</p>}
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
              {erros.senha && <p className="erro-mensagem">{erros.senha}</p>}

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
                value={ongConfirmarSenha}
                onChange={(e) => setOngConfirmarSenha(e.target.value)}
              />
              {erros.confirmar_senha && <p className="erro-mensagem">{erros.confirmar_senha}</p>}

            </div>

            <div className="coluna-2-inputs">
              <label htmlFor="ongTelefoneDenuncia">
                <div className="icon-input-ong">
                  <BiLogoInstagramAlt className="icon-cadastro" />
                  <p>Instagram da ONG (opcional):</p>
                </div>
              </label>
              <input
                id="ongTelefoneDenuncia"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o instagram da ONG"
                value={ongInstagram}
                onChange={(e) => setOngInstagram(e.target.value.replace(/^@/, ''))}
              />

              <label htmlFor="ongTelefone">
                <div className="icon-input-ong">
                  <FaPhoneAlt className="icon-cadastro" />
                  <p>Telefone de contato:</p>
                </div>
              </label>
              <input
                id="ongTelefone"
                className="input-cad-ong"
                type="text"
                placeholder="Digite o telefone da ONG"
                value={ongTelefone}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, '')
                    .replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2')
                    .slice(0, 15);
                  setOngTelefone(value)
                }}
              />
              {erros.telefone && <p className="erro-mensagem">{erros.telefone}</p>}
              <label htmlFor="ongEmailContatol">
                <div className="icon-input-ong">
                  <FaEnvelope className="icon-cadastro" />
                  <p>Email de contato:</p>
                </div>
              </label>
              <input
                id="ongEmailContato"
                className="input-cad-ong"
                type="email"
                placeholder="Digite o email de contato"
                value={ongEmailContato}
                onChange={(e) => setOngEmailContato(e.target.value.toLowerCase())}
              />
              {erros.email_contato && <p className="erro-mensagem">{erros.email_contato}</p>}
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
              {erros.nome_responsavel && <p className="erro-mensagem">{erros.nome_responsavel}</p>}
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
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, '')
                    .replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2')
                    .slice(0, 15);
                  setOngTelefoneResponsavel(value)
                }}
              />
              {erros.telefone_responsavel && <p className="erro-mensagem">{erros.telefone_responsavel}</p>}

            </div>

            <div className="coluna-3-inputs">

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
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  value = value.slice(0, 11);

                  const formattedValue = value
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

                  setOngCpfResponsavel(formattedValue);
                }}
              />
              {erros.cpf_responsavel && <p className="erro-mensagem">{erros.cpf_responsavel}</p>}

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
              {erros.data_nascimento_responsavel && <p className="erro-mensagem">{erros.data_nascimento_responsavel}</p>}
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
              {erros.estado_ong && <p className="erro-mensagem">{erros.estado_ong}</p>}

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
              {erros.cidade_ong && <p className="erro-mensagem">{erros.cidade_ong}</p>}

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
              {erros.endereco_ong && <p className="erro-mensagem">{erros.endereco_ong}</p>}


            </div>

          </div>
          <div className="input-desc">

            <label htmlFor="ongDescricao">
              <div className="icon-input-ong">
                <FaInfoCircle className="icon-cadastro" />
                <p>Descrição da ONG:</p>
              </div>
            </label>
            <textarea
              id="ongDescricao"
              className="input-cad-ong"
              placeholder="Digite uma breve descrição da ONG"
              value={ongDescricao}
              onChange={(e) => setOngDescricao(e.target.value)}
              maxLength={300}
            />
            {erros.descricao && <p className="erro-mensagem">{erros.descricao}</p>}
          </div>
          <div className="termos-ong">
            <p>
              Ao preencher o formulário acima você concorda com os nossos{" "}
              <a href="">Termos de Uso</a> e nossa{" "}
              <a href="">Política de Privacidade</a>.
            </p>
          </div>
          <div className="conteiner-botao-cad-ong">
            <button type="submit" className="botao-cad-ong">Cadastrar</button>
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
  );
}

export default CadastroONG;