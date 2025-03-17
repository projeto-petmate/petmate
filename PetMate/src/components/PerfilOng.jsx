import React from 'react'

function PerfilOng() {
    const [editMode, setEditMode] = useState(false);



  return (
    <div>
      <div className="conteiner-meus-anuncios">
       <CardPetPerfil />
      </div>
      <div className='conteiner-config-conta-ong'>
        <div className="texto-e-botao">
            <h2>Configurações de conta da ONG</h2>
            <img src="/images/barra_marrom.png" alt="" />
            <button className='botao-logout-ong'>
                <FiLogOut className='icon-logout' />
            </button>
        </div>
        <p>Dados do Perfil</p>
        <div className="add-img">
            <input
                id="file-upload"
                type="file"
            />
        </div>
        <div className="inputs-infom-ong">
            <div className="colum-1">
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                <input 
                    type="text"
                    name="email"
                    // value={userData.email || ''}
                    disabled />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                <input 
                    type="text"
                    name="email"
                    // value={userData.email || ''}
                    disabled />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                     type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
            </div>
            <div className='colum-2'>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                <input 
                     type="text"
                     name="nome"
                    //  value={userData.nome || ''}
                    //  onChange={handleChange}
                     disabled={!editMode}
                />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
            </div>
            <div className='colum-3'>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
                <label htmlFor="">E-mail da ONG*</label>
            <div className="input-ongs-mostra-info">
                 <input
                    type="text"
                    name="nome"
                    // value={userData.nome || ''}
                    // onChange={handleChange}
                    disabled={!editMode}
                                    />
                <FaEdit className='icon-lapis' />
            </div>
            </div>
        </div>
            <div className="botoes">
            {!editMode ?
                        <button className='botao-editar-perfil' onClick={() => setEditMode(true)} >
                            <div className="editar-dados">
                                Editar Dados
                                <FaEdit className='icon-edit' />
                            </div>
                        </button>
                        : (
                        <button className="botao-salvar-perfil" onClick={handleSave}>
                                <div className="salvar-dados">
                                    Salvar Dados
                                    <FaCheck className='icon-edit' />
                                </div>
                        </button>
            )}
            </div>
      </div>
    </div>
  )
}

export default PerfilOng
