import { useEffect, useRef } from 'react';

function ScrollUpBtn() {
  const btnRef = useRef(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return undefined;

    el.classList.add('reveal-item');

    function reveal() {
      if (window.scrollY > 300) {
        el.classList.add('reveal-item--is-visible');
      } else {
        el.classList.remove('reveal-item--is-visible');
      }
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        reveal();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="scroll-up-btn" ref={btnRef}>
      <a className="btn" href="#">
        <i className="fas fa-angle-up"></i>
      </a>
    </div>
  );
}

export default ScrollUpBtn;
