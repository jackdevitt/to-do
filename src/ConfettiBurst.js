import React, { useEffect } from 'react';
import Confetti from 'react-confetti';

const ConfettiBurst = ({ width, height }) => {
  useEffect(() => {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.style.position = 'relative';

    const confettiInterval = setInterval(() => {
      if (window.innerHeight - window.pageYOffset <= 0) {
        clearInterval(confettiInterval);
      }
    }, 100);

    return () => {
      clearInterval(confettiInterval);
    };
  }, []);

  return (
    <div id="confetti-container">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />
    </div>
  );
};

export default ConfettiBurst;
