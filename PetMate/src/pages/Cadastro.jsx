import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaCity, FaGlobeAmericas } from "react-icons/fa";
import { GlobalContext } from "../contexts/GlobalContext";
import { UserContext } from "../contexts/UserContext";
import { addUsuario } from '../apiService';
import InputMask from 'react-input-mask';
import { MdHolidayVillage } from "react-icons/md";

function Cadastro() {
    const { PhoneInput, CpfInput, setUserLogado } = useContext(GlobalContext);
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

    const validarFormulario = () => {
        if (!inptNomeCadastro) {
            return { geral: 'Todos os campos são obrigatórios.' };
        }
        if (!inptEmailCadastro) {
            return { geral: 'Todos os campos são obrigatórios.' };
        }
        if (!inptSenhaCadastro) {
            return { geral: 'Todos os campos são obrigatórios.' };
        }
        if (!inptTelefoneCadastro) {
            return { geral: 'Todos os campos são obrigatórios.' };
        }
        if (!inptCpfCadastro) {
            return { geral: 'Todos os campos são obrigatórios.' };
        }
        if (!termosCadastro) {
            return { geral: 'Você deve aceitar os termos e condições.' };
        }
        return {};
    };

    const CadastrarUsuario = async (e) => {
        e.preventDefault();

        const novosErros = validarFormulario();
        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
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
        };

        try {
            await addUsuario(novoUser);
            setUserLogado(novoUser);
            console.log("Usuário cadastrado:", novoUser);
            navigate("/login");
        } catch (error) {
            setErros({ email: 'Este email já está em uso' });
        }
    }

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
                            <Link to="/CadastroONG">
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
                                    onChange={(e) => setInptEmailCadastro(e.target.value)}
                                />
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
                                    onChange={(e) =>  setInptGeneroUser(e.target.value) } >
                                    <option value="" disabled>Selecione</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Outro">Outro</option>
                                </select>
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
                                <InputMask
                                    mask="(99) 99999-9999"
                                    value={inptTelefoneCadastro}
                                    onChange={(e) => setInptTelefoneCadastro(e.target.value)}
                                >
                                    {(inputProps) => <input {...inputProps} id="telefone" type="text" placeholder="(XX) X XXXX-XXXX" />}
                                </InputMask>
                            </div>
                            <div className="inpt-p">
                                <label htmlFor="cpf">
                                    <div className="icon-input">
                                        <FaIdCard className="icon-cadastro" />
                                        <p>CPF:</p>
                                    </div>
                                </label>
                                <InputMask
                                    mask="999.999.999-99"
                                    value={inptCpfCadastro}
                                    onChange={(e) => setInptCpfCadastro(e.target.value)}
                                >
                                    {(inputProps) => <input {...inputProps} id="cpf" type="text" placeholder="Digite seu CPF" />}
                                </InputMask>
                            </div>

                            <div className="inpt-p">
                                <label htmlFor="estado">
                                    <div className="icon-input">
                                        <FaGlobeAmericas className="icon-cadastro" />
                                        <p>Estado:</p>
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
                            </div>


                        </div>
                    </div>
                    {erros.email && <p className="erro-mensagem-user">{erros.email}</p>}
                    {erros.geral && <p className="erro-mensagem-user">{erros.geral}</p>}
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