import { useState, useEffect } from 'react';

// Port of legacy client/modules/typewriter.js — types/deletes through a list
// of words, looping forever. Returns the current text to render.
export default function useTypewriter(words, wait = 3000) {
  const [text, setText] = useState('');

  useEffect(() => {
    let curText = '';
    let wordIndex = 0;
    let isDeleting = false;
    let timeoutId;

    function tick() {
      let typeSpeed = 200;

      if (curText !== words[wordIndex] && !isDeleting) {
        curText = words[wordIndex].substring(0, curText.length + 1);
      } else if (!isDeleting) {
        isDeleting = true;
        typeSpeed = wait;
      } else {
        typeSpeed = Math.trunc(typeSpeed / 2);
        if (curText === '') {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          typeSpeed = 500;
        } else {
          curText = curText.substring(0, curText.length - 1);
        }
      }

      setText(curText);
      timeoutId = setTimeout(tick, typeSpeed);
    }

    tick();

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wait]);

  return text;
}
