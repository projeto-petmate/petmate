import './ModalColeiras.css';
import { CgCloseO } from 'react-icons/cg';

const ModalPromoColeira = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="tituloModalColeira">
          <h2 className="modal-title">Novidade incrível <br />
            no ar!
          </h2>
          <CgCloseO onClick={onClose} className="modal-close" />
        </div>

        <div className="info-coleiras">
          <p>
            Agora você pode comprar ou personalizar coleiras para seu pet com carinho e estilo!<br />
            Explore nossa lojinha pensada especialmente para seu melhor amigo.
          </p>

          <div className="modal-video-placeholder">
            aqui teria o vídeozinho rápido de cria que o Zézão vai fazer🙏
          </div>

          <button className="modal-button" onClick={onClose}>
            Confira já!
          </button>
        </div>

        <img
          className="dog-imageModal"
          src="/images/petModalColeira.png"
        />

      </div>
    </div>
  );
};

export default ModalPromoColeira;
