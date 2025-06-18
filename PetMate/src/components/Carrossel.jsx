import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrossel.css';
import { VscChevronLeft } from "react-icons/vsc";
import { VscChevronRight } from "react-icons/vsc";

const Carrossel = () => {
    const navigate = useNavigate();

    const banners = [
        { img: '/images/banner-adotar.svg', link: '/adotar' },
        { img: '/images/banner-feedback.svg', link: '/feedback' },
        { img: '/images/banner-ong.svg', link: '/ongs' },
        { img: '/images/banner-fav.svg', link: '/favoritos' },

    ].map(banner => ({ ...banner, loading: 'lazy' }));

    const [index, setIndex] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        setIntervalId(interval);

        return () => clearInterval(interval);
    }, [banners.length]);

    const handleClick = () => {
        navigate(banners[index].link);
    };

    const handlePrev = () => {
        setIndex((prev) => (prev - 1 + banners.length) % banners.length);
        resetTimer();
    };

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % banners.length);
        resetTimer();
    };

    const resetTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        const newInterval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        setIntervalId(newInterval);
    };

    return (
        <div className="carrossel-container">

            <button className="arrow left" onClick={handlePrev}>
                <VscChevronLeft />
            </button>

            <img
                src={banners[index].img}
                alt={`Banner ${index + 1}`}
                className="carrossel-banner"
                onClick={handleClick}
            />

            <button className="arrow right" onClick={handleNext}>
                <VscChevronRight />
            </button>

            <div className="carrossel-dots">
                {banners.map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`dot ${i === index ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carrossel;