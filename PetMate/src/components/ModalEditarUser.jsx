import React, { useState, useEffect } from 'react';
import './ModalEditarUser.css';

export default function ModalEditarUser({ isEditarUser, setUserEditOpen, onEditUser, userToEdit }) {
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');

    const getSurname = (fullName) => {
        return fullName.split(' ')[1];
    };

    
    useEffect(() => {
        if (userToEdit) {
            setEmail(userToEdit.email);
            setCpf(userToEdit.cpf);
            setNome(userToEdit.nome);
            // setSobrenome(getSurname(nome));
            setTelefone(userToEdit.telefone);
            setEndereco(userToEdit.endereco);
        }
    }, [userToEdit]);
    useEffect (() => {
        setSobrenome(getSurname(nome))
    })
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
            endereco,
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
                    {/* <label>Sobrenome</label>
                    <input
                        type="text"
                        value={sobrenome}
                        onChange={(e) => setSobrenome(e.target.value)}
                    /> */}
                    <label>Telefone</label>
                    <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />
                    <label>Endereço</label>
                    <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
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