import { useContext, useEffect, useState } from 'react'
import './CardDenuncia.css'
import { deleteDenuncia, updateDenuncia } from '../apiService';
import { GlobalContext } from '../contexts/GlobalContext';
import JanelaDenuncia from './JanelaDenuncia';
import { IoTrash } from 'react-icons/io5';
import ModalExcluirDenuncia from './ModalExcluirDenuncia';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function CardDenuncia({ filtrarPorUsuario = false }) {
    const { filtrarDenuncias, setDenuncias, isAdmin, userLogado } = useContext(GlobalContext);
    const [isJanelaOpen, setIsJanelaOpen] = useState(false)
    const [selectedDenuncia, setSelectedDenuncia] = useState(null)
    const [isExcluirDenuncia, setIsExcluirDenuncia] = useState(false);

    const denunciasFiltradas = filtrarDenuncias()
        .filter((d) => !filtrarPorUsuario || d.id_denunciante === userLogado?.id_usuario) // Verifica se userLogado está definido
        .sort((a, b) => b.id_denuncia - a.id_denuncia);

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


    // PAGINAÇÃO LOCAL
    const denunciasPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(denunciasFiltradas.length / denunciasPerPage);

    const startIndex = (currentPage - 1) * denunciasPerPage;
    const endIndex = startIndex + denunciasPerPage;
    const paginatedDenuncias = denunciasFiltradas.slice(startIndex, endIndex);

    return (
        <div>
            <div className="container-card-denuncia">
                <div className="cards-denuncia">

                    {paginatedDenuncias.length > 0 ? (
                        paginatedDenuncias.map((d) => (

                            <div key={d.id_denuncia} className='card-denuncia'>
                                <div className='texto-denuncia'>
                                    <h2 className='numero-da-denuncia'>Denúncia</h2>
                                    {isAdmin &&
                                        <h2 className='numero-da-denuncia'> # {d.id_denuncia}</h2>
                                    }
                                </div>
                                <div className='texto-mensagem'>
                                    {/* {d.mensagem} */}
                                </div>
                                <div className="info-denuncia">
                                    {isAdmin &&
                                        <p className="user-denuncia">
                                            Denunciante:{" "}
                                            {d.tipo_denunciante === "usuario"
                                                ? `Usuário (ID: ${d.id_denunciante})`
                                                : `ONG (ID: ${d.id_ong_denunciante})`}
                                        </p>
                                    }
                                    {isAdmin &&
                                        <p className='motivo-denuncia'>Tipo: {d.tipo_objeto}</p>
                                    }
                                    <p className='motivo-denuncia'>Motivo: {d.motivo}</p>
                                    <div className="status-denuncia">
                                        <p className={
                                            d.status === 'pendente'
                                                ? 'status-pendente'
                                                : d.status === 'em análise'
                                                    ? 'status-analise'
                                                    : 'status-resolvido'
                                        }>
                                            {d.status}</p>
                                    </div>
                                </div>
                                <div className="botoes-denuncia">
                                    {/* <button className='botao-status-denuncia' onClick={() => { setSelectedDenunciaId(d.id_denuncia); setIsModalOpen(true) }}>
                                                Atualizar status
                                                </button> */}
                                    <button className='botao-info-denuncia' onClick={() => { setSelectedDenuncia(d.id_denuncia); setIsJanelaOpen(true) }}>
                                        Informações
                                    </button>
                                    {isAdmin &&
                                        <IoTrash className="botao-excluir-denuncia" onClick={() => { setSelectedDenuncia(d.id_denuncia); setIsExcluirDenuncia(true); }} />
                                    }
                                </div>
                            </div>
                        ))
                    ) : (
                        filtrarPorUsuario ? (
                            <p className='sem-denuncias'>Você não possui nenhuma denúncia.</p>
                        ) : (
                            <p className='sem-denuncias'>Nenhuma denúncia foi realizada.</p>
                        )
                    )}
                </div>
                {/* Paginação visual */}
                {paginatedDenuncias.length > 0 && (
                    <div className="paginacao-denuncias">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FaArrowLeft className="icon-seta-pag" />
                            Anterior
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={currentPage === i + 1 ? 'active' : ''}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Próxima
                            <FaArrowRight className="icon-seta-pag" />
                        </button>
                    </div>
                )}
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
