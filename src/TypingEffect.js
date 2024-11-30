import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 150 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, speed * 0.5);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <h1>{displayedText}</h1>;
};

export default TypingEffect;