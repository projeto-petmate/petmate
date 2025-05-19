import React, { useState, useEffect } from 'react';
import './ModalEditarUser.css';

export default function ModalEditarUser({ isEditarUser, setUserEditOpen, onEditUser, userToEdit }) {
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');


    useEffect(() => {
        if (userToEdit) {
            setEmail(userToEdit.email);
            setCpf(userToEdit.cpf);
            setNome(userToEdit.nome);
            setTelefone(userToEdit.telefone);
            setEstado(userToEdit.uf);
            setCidade(userToEdit.cidade);
            setBairro(userToEdit.bairro);
        }
    }, [userToEdit]);

    if (!isEditarUser) {
        return null;
    }

    const handleSave = () => {
        const updatedUser = {
            ...userToEdit,
            email,
            cpf,
            nome,
            telefone,
            uf: estado,
            cidade,
            bairro,
        };
        onEditUser(updatedUser);
        setUserEditOpen(false);
    };

    return (
        <div className="editar-user-background" onClick={() => setUserEditOpen(false)}>
            <div className="editar-user-container" onClick={(e) => e.stopPropagation()}>
                <h2>Editar Usuário</h2>
                <div className="inputs-editar-user">
                    <label>Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                    />
                    <label>CPF</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        disabled
                    />
                    <label>Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <label>Telefone</label>
                    <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
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
                    <label>Bairro</label>
                    <input
                        type="text"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                    />
                </div>
                <div className="botoes-editar-user">
                    <button onClick={handleSave} className="botao-salvar-user">Salvar</button>
                    <button onClick={() => setUserEditOpen(false)} className="botao-cancelar-user">Cancelar</button>
                </div>
            </div>
        </div>
    );
}