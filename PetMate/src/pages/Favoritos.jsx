import { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import './Favoritos.css'
import { FaArrowLeft, FaArrowRight, FaRegStar, FaStar } from "react-icons/fa";
import { PetContext } from '../contexts/PetContext';
import JanelaPet from '../components/JanelaPet';
import { getPets } from '../apiService';
import LastPage from '../components/LastPage';
import { GlobalContext } from '../contexts/GlobalContext';

function Favoritos() {
    const [pets, setPets] = useState([]);
    const [openPetModal, setOpenPetModal] = useState(false);
    const { logado } = useContext(GlobalContext)
    const { setPet, favoritos, toggleFavorito } = useContext(PetContext);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const data = await getPets();
                setPets(data);
            } catch (error) {
                console.error("Erro ao buscar pets:", error);
            }
        };

        fetchPets();
    }, []);

    const getPetImage = (p) => {
        if (p.imagens) {
            const imgs = p.imagens.split(',').map(s => s.trim()).filter(Boolean);
            if (imgs.length > 0 && imgs[0]) return imgs[0];
        }
        if (p.imagem) return p.imagem;
        return "/images/default_pet_image.jpg";
    };

    const petsfavoritos = pets.filter(pet => favoritos.includes(pet.id_pet));

    // PAGINAÇÃO LOCAL
    const petsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(petsfavoritos.length / petsPerPage);

    const startIndex = (currentPage - 1) * petsPerPage;
    const endIndex = startIndex + petsPerPage;
    const paginatedPets = petsfavoritos.slice(startIndex, endIndex)

    return (
        <div>
            <JanelaPet isOpen={openPetModal} setPetModalOpen={() => setOpenPetModal(!openPetModal)} />
            <Navbar />
            <div className="banner-favoritos">
                <img src="/images/banner-fav.svg" loading='lazy' alt="" />
            </div>
            <div className='container-favoritos'>
                <div className="titulo-favoritos">
                    <h2>Favoritos</h2>
                    <p>Seus pets favoritos aparecerão aqui!</p>
                </div>
                <div className="card-favoritos">
                    {paginatedPets.length > 0 ? (
                        paginatedPets.map((p) => (
                            <div key={p.id_pet} className="pet-card-fav">
                                <img
                                    src={getPetImage(p) ? p.imagem : "/images/default_pet_image.jpg"}
                                    alt={`Imagem de ${p.nome}`}
                                    className="pet-image"
                                />
                                <div className="pet-info-card-fav">
                                    <h3>{p.nome}</h3>
                                    <h4><strong>Raça:</strong> {p.raca}</h4>
                                    <p><strong>Idade:</strong> {p.idade}</p>
                                    <p>{p.porte} | {p.genero}</p>
                                </div>

                                <div className="botoes-card-fav">
                                    <button className="botao-info-pet" onClick={() => {
                                        setPet(p);
                                        setOpenPetModal(true);
                                    }}>Mais informações</button>
                                    <button
                                        alt="Desfavoritar"
                                        className="favorito-icon"
                                        onClick={() => toggleFavorito(p.id_pet)}>
                                        <FaStar className='estrela-preenchida' />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        !logado ? (
                            <p className="sem-pets-fav">Você precisa entrar para favoritar pets.</p>
                        ) : (
                            <p className="sem-pets-fav">Você ainda não favoritou nenhum pet.</p>
                        )
                    )}
                </div>
                {paginatedPets.length > 0 &&
                    /* Paginação visual */
                    < div className="paginacao-favoritos">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FaArrowLeft className='icon-seta-pag' />
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
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Próxima
                            <FaArrowRight className='icon-seta-pag' />
                        </button>
                    </div>
                }
            </div>
            <LastPage />
            <Footer />
        </div>
    )
}

export default Favoritos
