import { useContext, useEffect, useState } from 'react'
import './CardDenuncia.css'
import { deleteDenuncia, updateDenuncia } from '../apiService';
import { GlobalContext } from '../contexts/GlobalContext';
import JanelaDenuncia from './JanelaDenuncia';
import { IoTrash } from 'react-icons/io5';
import ModalExcluirDenuncia from './ModalExcluirDenuncia';

function CardDenuncia() {
    const { filtrarDenuncias, setDenuncias } = useContext(GlobalContext);
    const [isJanelaOpen, setIsJanelaOpen] = useState(false)
    const [selectedDenuncia, setSelectedDenuncia] = useState(null)
    const [isExcluirDenuncia, setIsExcluirDenuncia] = useState(false);
    // const [isModalOpen, setIsModalOpen] = useState(false)
    // const [selectedDenunciaId, setSelectedDenunciaId] = useState(null)

    const denunciasFiltradas = filtrarDenuncias().sort((a, b) => b.id_denuncia - a.id_denuncia)

    // const handleStatusUpdate = async (id, updatedData) => {
    //     try {
    //         const updatedDenuncia = await updateDenuncia(id, updatedData);
    //         setDenuncias((prevDenuncias) =>
    //             prevDenuncias.map((d) => (d.id_denuncia === id ? updatedDenuncia : d))
    //         );
    //     } catch (error) {
    //         console.error('Erro ao atualizar status da denúncia:', error);
    //     }
    // };


    const deletarDenuncia = async () => {
        try {
            await deleteDenuncia(selectedDenuncia);
            setDenuncias((prevDenuncias) => prevDenuncias.filter((d) => d.id_denuncia !== selectedDenuncia));
            setSelectedDenuncia(null);
            setIsExcluirDenuncia(false); 
        } catch (error) {
            console.error('Erro ao deletar denúncia:', error);
        }
    };

    return (
        <div>
            <div className="container-card-denuncia">
                {denunciasFiltradas.map((d) => (
                    <div key={d.id_denuncia} className='card-denuncia'>
                        <h2 className='numero-da-denuncia'>Denúncia #{d.id_denuncia}</h2>
                        {/* <p className='mensagem-card'>Mensagem: </p> */}
                        <div className='texto-mensagem'>
                            {/* {d.mensagem} */}
                        </div>
                        <div className="info-denuncia">
                            <p className='user-denuncia'>ID do denunciante: {d.id_denunciante}</p>
                            <p className='motivo-denuncia'>Motivo: {d.motivo}</p>
                            <h3 className='status-denuncia'>Status: {d.status}</h3>
                        </div>
                        <div className="botoes-denuncia">
                            {/* <button className='botao-status-denuncia' onClick={() => { setSelectedDenunciaId(d.id_denuncia); setIsModalOpen(true) }}>
                                Atualizar status
                            </button> */}
                            <button className='botao-info-denuncia' onClick={() => { setSelectedDenuncia(d.id_denuncia); setIsJanelaOpen(true) }}>
                                Informações
                            </button>
                            <IoTrash className="botao-excluir-denuncia" onClick={() => { setSelectedDenuncia(d.id_denuncia); setIsExcluirDenuncia(true); }} />
                        </div>
                    </div>
                ))}
            </div>
            {/* <ModalStatus
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                idDenuncia={selectedDenunciaId}
                onStatusUpdate={handleStatusUpdate}
            /> */}
            <JanelaDenuncia
                isOpen={isJanelaOpen}
                setDenunciaModalOpen={setIsJanelaOpen}
                d={selectedDenuncia}
                onStatusUpdate={updateDenuncia}
            />
            <ModalExcluirDenuncia
                isExcluirDenuncia={isExcluirDenuncia}
                setDenunciaDeleteOpen={setIsExcluirDenuncia}
                onDeleteDenuncia={deletarDenuncia}
            />
        </div>
    )
}

export default CardDenuncia
