import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Carousel = ({ children }: { children: React.ReactNode[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
    };
    
    return (
        <div className="relative">
            <div className="flex items-center">
                <button className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-2 bg-transparent cursor-pointer" onClick={handlePrev}>
                    <ArrowBackIosIcon />
                </button>
                <div className="mx-auto">
                    {children[currentIndex]}
                </div>
                <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer" onClick={handleNext}>
                    <ArrowForwardIosIcon />
                </button>
            </div>
        </div>
    );
};

export default Carousel;
