import React, { useState, useEffect } from 'react';
import './ModalEditarOng.css';

export default function ModalEditarOng({ isEditarOng, setOngEditOpen, onEditOng, ongToEdit }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [telefoneDenuncia, setTelefoneDenuncia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [nomeResponsavel, setNomeResponsavel] = useState('');
    const [cpfResponsavel, setCpfResponsavel] = useState('');
    const [dataNascimentoResponsavel, setDataNascimentoResponsavel] = useState('');
    const [emailResponsavel, setEmailResponsavel] = useState('');
    const [telefoneResponsavel, setTelefoneResponsavel] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [endereco, setEndereco] = useState('');
    const [foto, setFoto] = useState('');
    const [imagemPreview, setImagemPreview] = useState(null);

    useEffect(() => {
        if (ongToEdit) {
            setNome(ongToEdit.nome_ong);
            setEmail(ongToEdit.email);
            setSenha(ongToEdit.senha || '');
            setTelefone(ongToEdit.telefone);
            setTelefoneDenuncia(ongToEdit.telefone_denuncia || '');
            setCnpj(ongToEdit.cnpj);
            setNomeResponsavel(ongToEdit.nome_responsavel);
            setCpfResponsavel(ongToEdit.cpf_responsavel);
            setDataNascimentoResponsavel(ongToEdit.data_nascimento_responsavel);
            setEmailResponsavel(ongToEdit.email_responsavel);
            setTelefoneResponsavel(ongToEdit.telefone_responsavel);
            setEstado(ongToEdit.estado_ong);
            setCidade(ongToEdit.cidade_ong);
            setEndereco(ongToEdit.endereco_ong);
            setFoto(ongToEdit.foto_ong);
            setImagemPreview(ongToEdit.foto_ong);
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
            telefone_denuncia: telefoneDenuncia,
            cnpj,
            nome_responsavel: nomeResponsavel,
            cpf_responsavel: cpfResponsavel,
            data_nascimento_responsavel: dataNascimentoResponsavel,
            email_responsavel: emailResponsavel,
            telefone_responsavel: telefoneResponsavel,
            estado_ong: estado,
            cidade_ong: cidade,
            endereco_ong: endereco,
            foto_ong: foto,
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
        reader.readAsDataURL(file);
    };

    return (
        <div className="editar-ong-background" onClick={() => setOngEditOpen(false)}>
            <div className="editar-ong-container" onClick={(e) => e.stopPropagation()}>
                <h2>Editar ONG</h2>
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
                        <label>Telefone de Denúncia</label>
                        <input
                            type="text"
                            value={telefoneDenuncia}
                            onChange={(e) => setTelefoneDenuncia(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input
                            type="text"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                        />
                        <label>Endereço</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
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
                        <label>Email do Responsável</label>
                        <input
                            type="email"
                            value={emailResponsavel}
                            onChange={(e) => setEmailResponsavel(e.target.value)}
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