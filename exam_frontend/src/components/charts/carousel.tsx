import React, { useState } from 'react';
import styles from './carousel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CarouselProps } from './types/CarouselProps';


const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setTransitioning] = useState(false);

  const goToNext = () => {
    if (!isTransitioning && currentIndex < items.length - 1) {
      setTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimeout(() => {
        setTransitioning(false);
      }, 500); // Adjust the delay based on your transition duration
    }
  };

  const goToPrev = () => {
    if (!isTransitioning && currentIndex > 0) {
      setTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setTimeout(() => {
        setTransitioning(false);
      }, 500); // Adjust the delay based on your transition duration
    }
  };

  return (
    <div className={styles['carousel']}>
      <div className={styles['carousel-inner']} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <div key={index} className={styles['carousel-item']}>{item}</div>
        ))}
      </div>
      <div
        onClick={goToPrev}
        className={`${styles['prev']} ${isTransitioning || currentIndex === 0 ? styles['hidden'] : ''}`}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      <div
        onClick={goToNext}
        className={`${styles['next']} ${isTransitioning || currentIndex === items.length - 1 ? styles['hidden'] : ''}`}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </div>
  );
};

export default Carousel;
