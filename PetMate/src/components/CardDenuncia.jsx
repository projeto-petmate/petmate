import { useContext, useState } from 'react'
import './CardDenuncia.css'
import { updateDenuncia } from '../apiService';
import ModalStatus from './ModalStatus';
import { GlobalContext } from '../contexts/GlobalContext';

function CardDenuncia() {
    const { filtrarDenuncias, setDenuncias, filtrosDenuncias } = useContext(GlobalContext);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDenunciaId, setSelectedDenunciaId] = useState(null)

    const denunciasFiltradas = filtrarDenuncias()

    const handleStatusUpdate = async (id, updatedData) => {
        try {
            const updatedDenuncia = await updateDenuncia(id, updatedData);
            setDenuncias((prevDenuncias) =>
                prevDenuncias.map((d) => (d.id_denuncia === id ? updatedDenuncia : d))
            );
        } catch (error) {
            console.error('Erro ao atualizar status da denúncia:', error);
        }
    };

    return (
        <div>
            <div className="container-card-denuncia">
                {denunciasFiltradas.map((d) => (
                    <div key={d.id_denuncia} className='card-denuncia'>
                        <h2 className='numero-da-denuncia'>Denúncia #{d.id_denuncia}</h2>
                        <p className='mensagem-card'>Mensagem: </p>
                        <p className='texto-mensagem'>
                        {d.mensagem}
                        </p>
                        <div className="motivo-status">
                        <p className='motivo-denuncia'>Motivo: {d.motivo}</p>
                        <h3 className='status-denuncia'>Status: {d.status}</h3>
                        </div>
                        <button className='botao-status-denuncia' onClick={() => { setSelectedDenunciaId(d.id_denuncia); setIsModalOpen(true) }}>
                            Atualizar status
                        </button>
                    </div>
                ))}
            </div>
            <ModalStatus
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                idDenuncia={selectedDenunciaId}
                onStatusUpdate={handleStatusUpdate}
                />
        </div>
    )
}

export default CardDenuncia
