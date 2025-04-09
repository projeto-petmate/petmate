import { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import './Favoritos.css'
import { FaRegStar, FaStar } from "react-icons/fa";
import { PetContext } from '../contexts/PetContext';
import JanelaPet from '../components/JanelaPet';
import { getPets } from '../apiService';

function Favoritos() {
    const [pets, setPets] = useState([]);
    const [openPetModal, setOpenPetModal] = useState(false);
    const { setPet, favoritos, toggleFavorito } = useContext(PetContext);
    const vrfOng = JSON.parse(localStorage.getItem("vrfOng"));

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

    const petsfavoritos = pets.filter(pet => favoritos.includes(pet.id_pet));

    return (
        <div>
            <JanelaPet isOpen={openPetModal} setPetModalOpen={() => setOpenPetModal(!openPetModal)} />
            <Navbar />
            <div className='container-favoritos'>
                <div className="titulo-favoritos">
                    <h2>Favoritos</h2>
                    <p>Seus pets favoritos aparecerão aqui!</p>
                </div>
                <div className="card-favoritos">
                {petsfavoritos.length > 0 ? (
                        petsfavoritos.map((p) => (
                            <div key={p.id_pet} className="pet-card-fav">
                                <img
                                    src={p.imagem ? p.imagem : "/images/default_pet_image.jpg"}
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
                        <p className="sem-pets-fav">Você ainda não favoritou nenhum pet.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Favoritos
