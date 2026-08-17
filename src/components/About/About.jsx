import DownloadCvButton from './DownloadCvButton.jsx';
import useRevealOnScroll from '../../hooks/useRevealOnScroll.js';

function About() {
  const photoRef = useRevealOnScroll(75);

  return (
    <section id="about" className="py-5 page-section--grey">
      <div className="container">
        <h2 className="text-center">About Me</h2>
        <div className="row">
          <div className="col-10 offset-1">
            <div className="about__photo" ref={photoRef}>
              <img src="/assets/images/profile.jpg" alt="Elvis Lee profile picture" />
            </div>
            <div>
              <p>
                When I’m not developing complex distributed systems to process
                data on millions real estate listing, you’ll probably find me
                slamming my guitar or trying (and failing) to perfect my latte
                art. I’m a software engineer who believes that both good code
                and good coffee require patience, practice, and creativity.
              </p>
              <p>
                I’m a backend software engineer with over nine years of
                experience, building scalable, high-performance APIs and
                data-driven systems using Java and Spring Boot. I have worked
                across frontend and backend for companies of various sizes —
                from agile startups where I wore many hats to large
                enterprises where precision and reliability were key.
              </p>
              <p>
                Over time, I’ve developed a strong focus on API design, data
                integration, and automation, with hands-on experience in
                cloud environments (GCP, Kubernetes) and CI/CD using Jenkins.
                I enjoy taking ownership of projects end to end — from design
                and implementation to monitoring and optimization — and
                finding ways to improve both the codebase and the developer
                experience.
              </p>
              <p>
                Beyond the code, I’m passionate about learning across
                disciplines — the “wannabe generalist” mindset — whether that
                means exploring DevOps, experimenting with AI tools, or
                simply understanding how different systems fit together.
              </p>
              <DownloadCvButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
