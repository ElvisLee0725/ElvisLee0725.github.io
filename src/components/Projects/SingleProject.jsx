import useRevealOnScroll from '../../hooks/useRevealOnScroll.js';

function SingleProject({
  data: { url, sourceCode, img, imgAlt, title, description, skills },
}) {
  const boxRef = useRevealOnScroll(75);

  return (
    <div className="col-12 col-md-6 portfolio-box" ref={boxRef}>
      <img src={img} className="img-fluid w-100" alt={imgAlt} />
      <div className="portfolio-box__overlay portfolio-box__overlay--bgDarkGrey">
        <div className="portfolio-box__caption px-3">
          <h4>{title}</h4>
          <h6 className="d-none d-sm-block">{description}</h6>
          <small>{skills}</small>
          <div className="mt-3">
            <a
              href={sourceCode}
              target="_blank"
              rel="noreferrer"
              className="portfolio-link"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Source Code"
            >
              <i className="fas fa-code fa-fw fa-2x mx-3"></i>
            </a>
            {/* Live Demo link disabled — the hosted demos no longer exist
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="portfolio-link"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Live Demo"
            >
              <i className="fas fa-desktop fa-fw fa-2x mx-3"></i>
            </a>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProject;
