import SingleIcon from './SingleIcon.jsx';
import useRevealOnScroll from '../../hooks/useRevealOnScroll.js';

const LanguageIcons = [
  { devicon: 'devicon-javascript-plain', title: 'JavaScript' },
  { devicon: 'devicon-java-plain', title: 'Java' },
  { devicon: 'devicon-redis-plain', title: 'Redis' },
  { devicon: 'devicon-elasticsearch-plain', title: 'Elasticsearch' },
  { devicon: 'devicon-python-plain', title: 'Python' },
  { devicon: 'devicon-postgresql-plain-wordmark', title: 'postgreSQL' },
];

const FrameworkIcons = [
  { devicon: 'devicon-react-original', title: 'React.js' },
  { devicon: 'devicon-nodejs-plain', title: 'Node.js' },
  { devicon: 'devicon-spring-original', title: 'Spring' },
  { devicon: 'devicon-fastapi-plain', title: 'FastAPI' },
  { devicon: 'devicon-apachekafka-original', title: 'Apache Kafka' },
  { devicon: 'devicon-redux-original', title: 'Redux' },
];

const DevToolIcons = [
  { devicon: 'devicon-amazonwebservices-plain', title: 'AWS' },
  { devicon: 'devicon-googlecloud-plain', title: 'Google Cloud' },
  { devicon: 'devicon-docker-plain', title: 'Docker' },
  { devicon: 'devicon-kubernetes-plain', title: 'Kubernetes' },
  { devicon: 'devicon-jenkins-plain', title: 'Jenkins' },
  { devicon: 'devicon-vault-original', title: 'Vault' },
];

function Skills() {
  const cardGroupRef = useRevealOnScroll(75);

  return (
    <>
      <section id="skills" className="page-section--red long-padding">
        <div className="container">
          <h2 className="text-center">My Skills</h2>
          <div className="row">
            <div className="col-10 offset-1 py-4">
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
            </div>
          </div>
        </div>
      </section>
      <section className="page-section--grey text-center py-5">
        <div className="container">
          <div className="card-group card-margin" ref={cardGroupRef}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title font-weight-bold">Languages &amp; DB</h5>
                <div className="row">
                  {LanguageIcons.map((icon) => (
                    <SingleIcon key={icon.title} data={icon} />
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title font-weight-bold">Frameworks</h5>
                <div className="row">
                  {FrameworkIcons.map((icon) => (
                    <SingleIcon key={icon.title} data={icon} />
                  ))}
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title font-weight-bold">Cloud &amp; DevOps</h5>
                <div className="row">
                  {DevToolIcons.map((icon) => (
                    <SingleIcon key={icon.title} data={icon} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Skills;
