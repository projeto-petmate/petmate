import React, { useState } from 'react';
import './CarrosselPet.css';

/**
 * @param {object} props - As propriedades do componente.
 * @param {string[]} props.images - Um array de URLs das imagens a serem exibidas.
 */
const CarrosselPet = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Funções para navegar entre as imagens
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  
  if (!images || images.length === 0) {
    return (
        <div className="carrossel-anunciar-pet-placeholder">
            <p>Nenhuma imagem selecionada</p>
        </div>
    );
  }

  return (
      <div
    className={
      `carrossel-anunciar-pet-container` +
      (images.length > 1 ? ' carrossel-anunciar-pet-multiplas' : ' carrossel-anunciar-pet-unica')
    }
  >
      {images.length > 1 && <button type="button" onClick={goToPrevious} className="carrossel-anunciar-pet-arrow prev">‹</button>}
      
      {/* Imagem Principal */}
      <div className="carrossel-anunciar-pet-image-wrapper">
        <img src={images[currentIndex]} alt={`Pré-visualização ${currentIndex + 1}`} className="carrossel-anunciar-pet-imagem-preview" />
      </div>

      {images.length > 1 && <button type="button" onClick={goToNext} className="carrossel-anunciar-pet-arrow next">›</button>}

      <div className="carrossel-anunciar-pet-dots">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            className={`carrossel-anunciar-pet-dot ${currentIndex === slideIndex ? 'active' : ''}`}
            onClick={() => goToSlide(slideIndex)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CarrosselPet;
