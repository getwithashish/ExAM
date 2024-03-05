// Main
import React from 'react';
import styles from './carousel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import CarouselProps from './types/CarouselType';
import { goToNext, goToPrev } from './CarouselHandler'; // Importing handlers

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setTransitioning] = React.useState(false);

  return (
    <div className={styles['carousel']}>
      <div className={styles['carousel-inner']} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <div key={index} className={styles['carousel-item']}>{item}</div>
        ))}
      </div>
      <div
        onClick={() => goToPrev(currentIndex, setTransitioning, setCurrentIndex, isTransitioning)}
        className={`${styles['prev']} ${isTransitioning || currentIndex === 0 ? styles['hidden'] : ''}`}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      <div
        onClick={() => goToNext(currentIndex, setTransitioning, setCurrentIndex, isTransitioning, items)}
        className={`${styles['next']} ${isTransitioning || currentIndex === items.length - 1 ? styles['hidden'] : ''}`}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </div>
  );
};

export default Carousel;
