import useTypewriter from '../../hooks/useTypewriter.js';

function Carousel() {
  const typedText = useTypewriter(
    ['Full Stack Developer', 'Software Engineer', 'Programmer'],
    1500
  );

  return (
    <section id="cover">
      <div className="container-fluid">
        <div className="row">
          <div
            id="elvisCarousel"
            className="carousel slide w-100"
            data-ride="carousel"
            data-interval="3000"
          >
            <ol className="carousel-indicators">
              <li
                data-target="#elvisCarousel"
                data-slide-to="0"
                className="active"
              ></li>
            </ol>

            <div className="carousel-inner" role="listbox">
              <div className="carousel-item active">
                <picture>
                  <source
                    srcSet="/assets/images/carousel/coding-cover-xl.jpg"
                    media="(min-width: 1380px)"
                  />
                  <source
                    srcSet="/assets/images/carousel/coding-cover-lg.jpg"
                    media="(min-width: 990px)"
                  />
                  <source
                    srcSet="/assets/images/carousel/coding-cover-md.jpg"
                    media="(min-width: 640px)"
                  />
                  <img
                    src="/assets/images/carousel/coding-cover-sm.jpg"
                    className="d-block w-100"
                    alt="Elvis Lee Coding Cover"
                  />
                </picture>
                <div>
                  <div className="carousel-caption">
                    <h3 className="large-hero__title">
                      I'm Elvis Lee the{' '}
                      <span id="typewriter" className="typing-cursor">
                        {typedText}
                      </span>
                    </h3>
                    <h4 className="large-hero__subtitle">
                      Work with passion and perseverance
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <a
              className="carousel-control-prev"
              href="#elvisCarousel"
              role="button"
              data-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href="#elvisCarousel"
              role="button"
              data-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Carousel;
