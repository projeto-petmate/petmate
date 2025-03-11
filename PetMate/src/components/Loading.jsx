import React from 'react'

function Loading() {

    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const hasReloaded = localStorage.getItem('hasReloaded');
  
      setLoading(true); // Ativa o loading
  
      if (!hasReloaded) {
          localStorage.setItem('hasReloaded', 'true');
          window.location.reload();
      } else {
          localStorage.removeItem('hasReloaded');
  
          setTimeout(() => {
            setLoading(false);
        }, 500); 
      }
  }, []);
  
  if (loading) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Fundo semi-transparente
        zIndex: 9999, // Fica sobre tudo
    }}>
        <BeatLoader color="#8B4513" size={20} />
    </div>
    );
  }
}

export default Loading
