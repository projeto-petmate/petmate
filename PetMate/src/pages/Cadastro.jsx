import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaCity, FaGlobeAmericas } from "react-icons/fa";
import { GlobalContext } from "../contexts/GlobalContext";
import { UserContext } from "../contexts/UserContext";
import { addUsuario, getUserByEmail, verificarCpfUnico, verificarEmailUnico } from '../apiService';
import { MdHolidayVillage } from "react-icons/md";
import Swal from 'sweetalert2';
import { cpf } from 'cpf-cnpj-validator';


function Cadastro() {
    const { setUserLogado } = useContext(GlobalContext);
    const {
        inptNomeCadastro, setInptNomeCadastro,
        inptEmailCadastro, setInptEmailCadastro,
        inptSenhaCadastro, setInptSenhaCadastro,
        inptTelefoneCadastro, setInptTelefoneCadastro,
        inptCpfCadastro, setInptCpfCadastro,
        inptEstadoUser, setInptEstadoUser,
        inptCidadeUser, setInptCidadeUser,
        inptBairroUser, setInptBairroUser,
        inptGeneroUser, setInptGeneroUser,
        termosCadastro, setTermosCadastro,
        addUser
    } = useContext(UserContext);
    const [inptConfirmarSenha, setInptConfirmarSenha] = useState()

    const [erros, setErros] = useState({});
    const navigate = useNavigate();

    const validarFormulario = async () => {
        const novosErros = {};

        if (!inptNomeCadastro) {
            novosErros.nome = 'O nome é obrigatório.';
        }
        else if (inptNomeCadastro.length < 6) {
            novosErros.nome = 'O nome deve ter pelo menos 6 caractéres'
        } else if (/[^a-zA-ZÀ-ÿ\s]/.test(inptNomeCadastro)) {
            novosErros.nome = 'O nome não pode conter caracteres especiais ou números.'
        }

        if (!inptEmailCadastro) {
            novosErros.email = 'O email é obrigatório.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inptEmailCadastro)) {
            novosErros.email = 'O email não é válido.';
        } else {
            try {
                const emailExiste = await getUserByEmail(inptEmailCadastro.toLowerCase());
                if (emailExiste) {
                    novosErros.email = `Este email já está em uso`;
                }
            } catch (error) {
                console.error('Erro ao verificar email:', error);
                novosErros.email = 'Erro ao verificar email. Tente novamente mais tarde.';
            }
        }
        if (!inptSenhaCadastro) {
            novosErros.senha = 'A senha é obrigatória.';
        }
        else if (inptSenhaCadastro.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(inptSenhaCadastro)) {
            novosErros.senha = 'A senha deve ter pelo menos 8 caractéres e conter pelo menos um caractére especial.';
        }

        else if (inptSenhaCadastro !== inptConfirmarSenha) {
            novosErros.confirmar_senha = 'As senhas não coincidem.';
        }
        if (!inptTelefoneCadastro) {
            novosErros.telefone = 'O telefone é obrigatório.';
        }

        if (!inptCpfCadastro) {
            novosErros.cpf = 'O CPF é obrigatório.';
        } else if (!cpf.isValid(inptCpfCadastro)) {
            novosErros.cpf = 'O CPF é inválido.';
        } else {
            const cpfExiste = await verificarCpfUnico(inptCpfCadastro);
            if (cpfExiste) {
                novosErros.cpf = 'Este CPF já está em uso.';
            }
        }

        if (!inptGeneroUser) {
            novosErros.genero = 'O gênero é obrigatório.';
        }

        if (!inptEstadoUser) {
            novosErros.estado = 'A UF é obrigatória.'
        }

        if (!inptCidadeUser) {
            novosErros.cidade = 'A cidade é obrigatória.';
        }

        if (!inptBairroUser) {
            novosErros.bairro = 'O bairro é obrigatório.';
        }

        if (!termosCadastro) {
            novosErros.termos = 'Você deve aceitar os termos e condições.';
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


    const CadastrarUsuario = async (e) => {
        e.preventDefault();

        const formularioValido = await validarFormulario();
        if (!formularioValido) {
            return;
        }

        const novoUser = {
            nome: inptNomeCadastro,
            email: inptEmailCadastro,
            genero: inptGeneroUser,
            senha: inptSenhaCadastro,
            telefone: inptTelefoneCadastro,
            cpf: inptCpfCadastro,
            uf: inptEstadoUser,
            cidade: inptCidadeUser,
            bairro: inptBairroUser,
            termos: termosCadastro,
            tipo: 'user',
            data_criacao: new Date().toISOString(),
        };
        try {
            await addUser(novoUser);
            setUserLogado(novoUser);
            console.log("Usuário cadastrado:", novoUser);

            setInptNomeCadastro('');
            setInptEmailCadastro('');
            setInptGeneroUser('');
            setInptSenhaCadastro('');
            setInptConfirmarSenha('');
            setInptTelefoneCadastro('');
            setInptCpfCadastro('');
            setInptEstadoUser('');
            setInptCidadeUser('');
            setInptBairroUser('');
            setTermosCadastro(false);

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
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao cadastrar usuário. Tente novamente mais tarde.',
                confirmButtonColor: '#84644D',
            });
        }
    };

    return (
        <div>
            <form className="container-cadastro" onSubmit={CadastrarUsuario}>
                <div className="container-img">
                    <img src="/images/cachorro-cadastro (1).png" alt="" className="img-cadastro" />
                </div>

                <main className="info-cadastro">
                    <div className="texto-cadastro">
                        <div className="barra-img">
                            <h2>Cadastre-se</h2>
                            <img src="/images/barra_marrom.png" className="barra_cadastro" />
                        </div>

                        <div className="botoes-cad-login">
                            <Link to="/cadastro-ong">
                                <button>Sou uma ONG</button>
                            </Link>
                            <Link to="/login">
                                <button>Login</button>
                            </Link>
                        </div>
                    </div>

                    <div className="inputs-cadastro">
                        <div className="inputs-column">
                            <div className="inpt-p">
                                <label htmlFor="nome">
                                    <div className="icon-input">
                                        <FaUser className="icon-cadastro" />
                                        <p>Nome:</p>
                                    </div>
                                </label>
                                <input
                                    id="nome"
                                    type="text"
                                    placeholder="Digite seu nome"
                                    value={inptNomeCadastro}
                                    onChange={(e) => setInptNomeCadastro(e.target.value)}
                                />
                                {erros.nome && <p className="erro-input-user">{erros.nome}</p>}
                            </div>

                            <div className="inpt-p">
                                <label htmlFor="email">
                                    <div className="icon-input">
                                        <FaEnvelope className="icon-cadastro" />
                                        <p>Email:</p>
                                    </div>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={inptEmailCadastro}
                                    onChange={(e) => setInptEmailCadastro(e.target.value.toLowerCase())}
                                />
                                {erros.email && <p className="erro-input-user">{erros.email}</p>}
                            </div>

                            <div className="inpt-p">
                                <label htmlFor="genero">
                                    <div className="icon-input">
                                        <FaUser className="icon-cadastro" />
                                        <p>Gênero:</p>
                                    </div>
                                </label>
                                <select
                                    id="genero"
                                    className="select-genero-user"
                                    value={inptGeneroUser}
                                    onChange={(e) => setInptGeneroUser(e.target.value)} >
                                    <option value="" disabled>Selecione</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                                {erros.genero && <p className="erro-input-user">{erros.genero}</p>}
                            </div>

                            <div className="inpt-p">
                                <label htmlFor="senha">
                                    <div className="icon-input">
                                        <FaLock className="icon-cadastro" />
                                        <p>Senha:</p>
                                    </div>
                                </label>
                                <input
                                    id="senha"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={inptSenhaCadastro}
                                    onChange={(e) => setInptSenhaCadastro(e.target.value)}
                                />
                                {erros.senha && <p className="erro-input-user">{erros.senha}</p>}

                            </div>

                            <div className="inpt-p">
                                <label htmlFor="confirmarSenha">
                                    <div className="icon-input">
                                        <FaLock className="icon-cadastro" />
                                        <p>Confirmar senha:</p>
                                    </div>
                                </label>
                                <input
                                    id="confirmarSenha"
                                    type="password"
                                    placeholder="Confirme sua senha"
                                    value={inptConfirmarSenha}
                                    onChange={(e) => setInptConfirmarSenha(e.target.value)}
                                />
                                {erros.confirmar_senha && <p className="erro-input-user">{erros.confirmar_senha}</p>}
                            </div>


                        </div>

                        <div className="inputs-column">
                            <div className="inpt-p">
                                <label htmlFor="telefone">
                                    <div className="icon-input">
                                        <FaPhone className="icon-telefone" />
                                        <p>Telefone:</p>
                                    </div>
                                </label>
                                <input
                                    id="telefone"
                                    type="text"
                                    placeholder="(XX) X XXXX-XXXX"
                                    value={inptTelefoneCadastro}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            .replace(/\D/g, '')
                                            .replace(/(\d{2})(\d)/, '($1) $2')
                                            .replace(/(\d{5})(\d)/, '$1-$2')
                                            .slice(0, 15);
                                        setInptTelefoneCadastro(value);
                                    }}
                                />
                                {erros.telefone && <p className="erro-input-user">{erros.telefone}</p>}
                            </div>
                            <div className="inpt-p">
                                <label htmlFor="cpf">
                                    <div className="icon-input">
                                        <FaIdCard className="icon-cadastro" />
                                        <p>CPF:</p>
                                    </div>
                                </label>
                                <input
                                    id="cpf"
                                    type="text"
                                    placeholder="000.000.000-00"
                                    value={inptCpfCadastro}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        value = value.slice(0, 11);

                                        const formattedValue = value
                                            .replace(/(\d{3})(\d)/, '$1.$2')
                                            .replace(/(\d{3})(\d)/, '$1.$2')
                                            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

                                        setInptCpfCadastro(formattedValue);
                                    }}
                                />
                                {erros.cpf && <p className="erro-input-user">{erros.cpf}</p>}
                            </div>

                            <div className="inpt-p">
                                <label htmlFor="estado">
                                    <div className="icon-input">
                                        <FaGlobeAmericas className="icon-cadastro" />
                                        <p>UF:</p>
                                    </div>
                                </label>
                                <select
                                    id="estado"
                                    className="select-estado-user"
                                    value={inptEstadoUser}
                                    onChange={(e) => setInptEstadoUser(e.target.value)}
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
                                {erros.estado && <p className="erro-input-user">{erros.estado}</p>}
                            </div>

                            <div className="inpt-p">
                                <label htmlFor="cidade">
                                    <div className="icon-input">
                                        <FaCity className="icon-cadastro" />
                                        <p>Cidade:</p>
                                    </div>
                                </label>
                                <input
                                    id="cidade"
                                    type="text"
                                    placeholder="Digite sua cidade"
                                    value={inptCidadeUser}
                                    onChange={(e) => setInptCidadeUser(e.target.value)}
                                />
                                {erros.cidade && <p className="erro-input-user">{erros.cidade}</p>}
                            </div>

                            <div className="inpt-p">
                                <label htmlFor="bairro">
                                    <div className="icon-input">
                                        <MdHolidayVillage className="icon-cadastro" />
                                        <p>Bairro:</p>
                                    </div>
                                </label>
                                <input
                                    id="bairro"
                                    type="text"
                                    placeholder="Digite seu bairro"
                                    value={inptBairroUser}
                                    onChange={(e) => setInptBairroUser(e.target.value)}
                                />
                                {erros.bairro && <p className="erro-input-user">{erros.bairro}</p>}
                            </div>


                        </div>
                    </div>
                    {erros.termos && <p className="erro-termos">{erros.termos}</p>}

                    <div className="botao-termos-cadastro">
                        <div className="termos">
                            <input
                                type="checkbox"
                                checked={termosCadastro}
                                onChange={(e) => setTermosCadastro(e.target.checked)}
                            />
                            <p>
                                Ao preencher o formulário acima você concorda com os nossos{" "}
                                <a href="">Termos de Uso</a> e nossa{" "}
                                <a href="">Política de Privacidade</a>.
                            </p>
                        </div>
                        <button type="submit">Cadastrar</button>
                    </div>
                </main>
            </form>
        </div>
    );
}

export default Cadastro;