import ContactCta from './ContactCta.jsx';
import Footer from './Footer.jsx';
import useRevealOnScroll from '../../hooks/useRevealOnScroll.js';

function Contact() {
  const ctaRef = useRevealOnScroll(75);

  return (
    <section id="contact" className="py-5 text-center contact-bg">
      <div className="container">
        <h2>Contact</h2>
        <div className="row">
          <div className="col-10 offset-1 col-md-6 offset-md-3">
            <div className="py-4 contact-form" ref={ctaRef}>
              <ContactCta />
            </div>

            <div className="contact-icons pb-4">
              <a href="//twitter.com/elvislee0725" target="_blank" rel="noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="//www.facebook.com/elvislee0725" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-square"></i>
              </a>
              <a href="//github.com/ElvisLee0725" target="_blank" rel="noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="//www.linkedin.com/in/elvislee" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
}

export default Contact;
