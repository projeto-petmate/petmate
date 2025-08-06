import './ModalColeiras.css';
import { CgCloseO } from 'react-icons/cg';

const ModalPromoColeira = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="tituloModalColeira">
          <h2 className="modal-title">Novidade incrível no ar!</h2>
          <CgCloseO onClick={onClose} className="modal-close" />
        </div>

          <p>
            Agora você pode comprar ou personalizar coleiras para seu pet com carinho e estilo!<br />
            Explore nossa lojinha pensada especialmente para seu melhor amigo.
          </p>

          <div className="modal-video-placeholder">
            aqui teria o vídeozinho rápido
          </div>

          <button className="modal-button" onClick={onClose}>
            Conhecer agora!
          </button>
        
        <img
          className="dog-image"
          src="/images/dog-coleira.png"
          alt="Cachorro com coleira"
        />
      </div>
    </div>
  );
};

export default ModalPromoColeira;
