import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaIdCard } from "react-icons/fa";
import { GlobalContext } from "../contexts/GlobalContext";
import { UserContext } from "../contexts/UserContext";
import { addUsuario } from '../apiService';
import InputMask from 'react-input-mask';

function Cadastro() {
    const { PhoneInput, CpfInput, setUserLogado } = useContext(GlobalContext);
    const {
        inptNomeCadastro, setInptNomeCadastro,
        inptEmailCadastro, setInptEmailCadastro,
        inptSenhaCadastro, setInptSenhaCadastro,
        inptTelefoneCadastro, setInptTelefoneCadastro,
        inptEnderecoCadastro, setInptEnderecoCadastro,
        inptCpfCadastro, setInptCpfCadastro,
        termosCadastro, setTermosCadastro,
        addUser
    } = useContext(UserContext);

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
        if (!inptEnderecoCadastro) {
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
            senha: inptSenhaCadastro,
            telefone: inptTelefoneCadastro,
            endereco: inptEnderecoCadastro,
            cpf: inptCpfCadastro,
            termos: termosCadastro
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
                    <img src="/images/dog_marrom2.svg" alt="" className="img-cadastro" />
                </div>

                <main className="info-cadastro">
                    <div className="texto-cadastro">
                        <div className="barra-img">
                            <h2>Cadastre-se</h2>
                            <img src="/images/barra_marrom.png" className="barra_cadastro" />
                        </div>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
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
                                <label htmlFor="endereco">
                                    <div className="icon-input">
                                        <FaMapMarkerAlt className="icon-cadastro" />
                                        <p>Endereço:</p>
                                    </div>
                                </label>
                                <input
                                    id="endereco"
                                    type="text"
                                    placeholder="Digite seu endereço"
                                    value={inptEnderecoCadastro}
                                    onChange={(e) => setInptEnderecoCadastro(e.target.value)}
                                />
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
                        </div>
                    </div>
                            {erros.email && <p className="erro-mensagem">{erros.email}</p>}
                            {erros.geral && <p className="erro-mensagem">{erros.geral}</p>}
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