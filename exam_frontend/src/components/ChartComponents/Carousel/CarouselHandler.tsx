// Handlers
export const goToNext = (
    currentIndex: number,
    setTransitioning: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
    isTransitioning: boolean,
    items: JSX.Element[]
  ) => {
    if (!isTransitioning && currentIndex < items.length - 1) {
      setTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimeout(() => {
        setTransitioning(false);
      }, 500); // Adjust the delay based on your transition duration
    }
  };
  
  export const goToPrev = (
    currentIndex: number,
    setTransitioning: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
    isTransitioning: boolean,
  ) => {
    if (!isTransitioning && currentIndex > 0) {
      setTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setTimeout(() => {
        setTransitioning(false);
      }, 500); // Adjust the delay based on your transition duration
    }
  };
  