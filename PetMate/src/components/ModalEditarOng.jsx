import React, { useState, useEffect } from 'react';
import './ModalEditarOng.css';
import { FaTrash } from 'react-icons/fa';

export default function ModalEditarOng({ isEditarOng, setOngEditOpen, onEditOng, ongToEdit }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [instagram, setInstagram] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [cpfResponsavel, setCpfResponsavel] = useState('');
    const [dataNascimentoResponsavel, setDataNascimentoResponsavel] = useState('');
    const [emailContato, setEmailContato] = useState('');
    const [telefoneResponsavel, setTelefoneResponsavel] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [endereco, setEndereco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState('');
    const [imagemPreview, setImagemPreview] = useState(null);
    const [etapa, setEtapa] = useState(1)
    
    useEffect(() => {
        if (ongToEdit) {
            setNome(ongToEdit.nome_ong);
            setEmail(ongToEdit.email);
            setSenha(ongToEdit.senha || '');
            setTelefone(ongToEdit.telefone);
            setInstagram(ongToEdit.instagram || '');
            setCnpj(ongToEdit.cnpj);
            setNomeResponsavel(ongToEdit.nome_responsavel);
            setCpfResponsavel(ongToEdit.cpf_responsavel);
            setDataNascimentoResponsavel(ongToEdit.data_nascimento_responsavel);
            setEmailContato(ongToEdit.email_contato);
            setTelefoneResponsavel(ongToEdit.telefone_responsavel);
            setEstado(ongToEdit.estado);
            setCidade(ongToEdit.cidade);
            setEndereco(ongToEdit.endereco);
            setFoto(ongToEdit.foto_perfil);
            setImagemPreview(ongToEdit.foto_perfil);
            setDescricao(ongToEdit.descricao || '');
            // setTipo(ongToEdit.tipo || '');
            // setCodigoVerificacao(ongToEdit.codigo_verificacao || '');
        }
    }, [ongToEdit]);

    if (!isEditarOng) {
        return null;
    }

    const handleSave = () => {
        const updatedOng = {
            ...ongToEdit,
            nome_ong: nome,
            email,
            senha,
            telefone,
            instagram: instagram,
            cnpj,
            nome_responsavel: nomeResponsavel,
            cpf_responsavel: cpfResponsavel,
            data_nascimento_responsavel: dataNascimentoResponsavel,
            telefone_responsavel: telefoneResponsavel,
            estado_ong: estado,
            cidade_ong: cidade,
            endereco_ong: endereco,
            foto_perfil: foto,
        };
        onEditOng(updatedOng);
        setOngEditOpen(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFoto(reader.result);
            setImagemPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setFoto('');
        setImagemPreview(null);
    };

    return (
        <div className="editar-ong-background" onClick={() => setOngEditOpen(false)}>
            <div className="editar-ong-container" onClick={(e) => e.stopPropagation()}>
                <h2>Editar ONG</h2>
                    <label>Foto de Perfil</label>
                <div className="edit-imagem-ong">
                    <div className="add-img-ong" onClick={() => document.getElementById('file-upload-ong').click()}>
                        Alterar Foto
                    </div>
                    <input
                        id="file-upload-ong"
                        type="file"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    {imagemPreview && (
                        <div className="imagem-preview-container">
                            <img
                                src={imagemPreview}
                                alt="Pré-visualização"
                                className="imagem-preview-ong"
                            />
                            <FaTrash className="remove-img-btn" onClick={handleRemovePhoto}>
                                Remover Foto
                            </FaTrash>
                        </div>
                    )}
                </div>
                <div className="inputs-editar-ong">
                    <div className="coluna-editar-ong">
                        <label>Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Email de Contato</label>
                        <input
                            type="email"
                            value={emailContato}
                            onChange={(e) => setEmailContato(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input
                            type="text"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                        />
                        <label>Senha</label>
                        <input
                            type="text"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <label>Telefone</label>
                        <input
                            type="text"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                        <label>Instagram</label>
                        <input
                            type="text"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                        />
                    </div>
                    <div className="coluna-editar-ong">
                        <label>Nome do Responsável</label>
                        <input
                            type="text"
                            value={nomeResponsavel}
                            onChange={(e) => setNomeResponsavel(e.target.value)}
                        />
                        <label>CPF do Responsável</label>
                        <input
                            type="text"
                            value={cpfResponsavel}
                            onChange={(e) => setCpfResponsavel(e.target.value)}
                        />
                        <label>Data de Nascimento do Responsável</label>
                        <input
                            type="text"
                            value={dataNascimentoResponsavel}
                            onChange={(e) => setDataNascimentoResponsavel(e.target.value)}
                        />

                        <label>Telefone do Responsável</label>
                        <input
                            type="text"
                            value={telefoneResponsavel}
                            onChange={(e) => setTelefoneResponsavel(e.target.value)}
                        />
                        <label>Estado</label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
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
                        <label>Cidade</label>
                        <input
                            type="text"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                        />
                        <label>Endereço</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />
                    </div>
                </div>
                {/* <div className="edit-imagem-ong">
          <label>Foto</label>
          <input
            type="file"
            onChange={handleImageChange}
          />
          {imagemPreview && (
            <img
              src={imagemPreview}
              alt="Pré-visualização"
              className="imagem-preview-ong"
            />
          )}
        </div> */}
                <div className="botoes-editar-ong">
                    <button onClick={handleSave} className="botao-salvar-ong">Salvar</button>
                    <button onClick={() => setOngEditOpen(false)} className="botao-cancelar-ong">Cancelar</button>
                </div>
            </div>
        </div>
    );
}