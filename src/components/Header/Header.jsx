import { useEffect, useRef } from 'react';

function Header({ onOpenResume }) {
  const headerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    function headerScroll() {
      const el = headerRef.current;
      if (!el) return;
      if (window.scrollY > 70) {
        el.classList.add('menu-bg--show');
      } else {
        el.classList.remove('menu-bg--show');
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        headerScroll();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="navbar fixed-top navbar-expand-md navbar-dark menu-bg"
      id="navbar-elvislee"
      ref={headerRef}
    >
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav">
            <li data-toggle="collapse" data-target=".navbar-collapse.show">
              <a className="nav-item nav-link" href="#about">
                ABOUT
              </a>
            </li>
            <li data-toggle="collapse" data-target=".navbar-collapse.show">
              <a className="nav-item nav-link" href="#projects">
                PROJECTS
              </a>
            </li>
            <li data-toggle="collapse" data-target=".navbar-collapse.show">
              <a className="nav-item nav-link" href="#skills">
                SKILLS
              </a>
            </li>
            <li data-toggle="collapse" data-target=".navbar-collapse.show">
              <a className="nav-item nav-link" href="#contact">
                CONTACT
              </a>
            </li>
            <li data-toggle="collapse" data-target=".navbar-collapse.show">
              <a
                className="nav-item nav-link"
                id="openModal"
                style={{ cursor: 'pointer' }}
                onClick={onOpenResume}
              >
                RESUME
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
