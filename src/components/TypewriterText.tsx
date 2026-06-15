import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

export const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const onCompleteRef = useRef(onComplete);

  // Keep the latest callback reference up to date without triggering effects
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const words = text.split(' ');
    let wordIndex = 0;
    setDisplayedText('');

    const timer = setInterval(() => {
      if (wordIndex < words.length) {
        const currentWords = words.slice(0, wordIndex + 1).join(' ');
        setDisplayedText(currentWords);
        wordIndex++;
      } else {
        clearInterval(timer);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 25); // snappier 25ms interval

    return () => clearInterval(timer);
  }, [text]); // Strictly only trigger when content changes

  return (
    <div className="markdown-body">
      <Markdown>{displayedText}</Markdown>
    </div>
  );
};
