import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrossel.css';
import { HiArrowCircleLeft } from "react-icons/hi";
import { HiArrowCircleRight } from "react-icons/hi";

const Carrossel = () => {
    const navigate = useNavigate();

    const banners = [
        { img: '/images/banner-home-2025.svg', link: '/home' },
        { img: '/images/banner-adotar-2025.svg', link: '/adotar' },
        { img: '/images/banner-feedback.svg', link: '/feedback' },
        { img: '/images/banner-ong.svg', link: '/ongs' },
        { img: '/images/banner-Favoritos.svg', link: '/favoritos' },
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const handleClick = () => {
        navigate(banners[index].link);
    };

    const handlePrev = () => {
        setIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % banners.length);
    };

    return (
        <div className="carrossel-container">

            <button className="arrow left" onClick={handlePrev}>
                <HiArrowCircleLeft />
            </button>

            <img
                src={banners[index].img}
                alt={`Banner ${index + 1}`}
                className="carrossel-banner"
                onClick={handleClick}
            />

            <button className="arrow right" onClick={handleNext}>
                <HiArrowCircleRight />
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