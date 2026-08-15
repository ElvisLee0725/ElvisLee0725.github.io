import SingleIcon from './SingleIcon.jsx';
import useRevealOnScroll from '../../hooks/useRevealOnScroll.js';

const LanguageIcons = [
  { devicon: 'devicon-javascript-plain', title: 'JavaScript' },
  { devicon: 'devicon-java-plain', title: 'Java' },
  { devicon: 'devicon-html5-plain-wordmark', title: 'HTML5' },
  { devicon: 'devicon-css3-plain-wordmark', title: 'CSS3' },
  { devicon: 'devicon-python-plain', title: 'Python' },
  { devicon: 'devicon-php-plain', title: 'PHP' },
];

const FrameworkIcons = [
  { devicon: 'devicon-react-original', title: 'React.js' },
  { devicon: 'devicon-nodejs-plain', title: 'Node.js' },
  { devicon: 'devicon-express-original', title: 'Express' },
  { devicon: 'devicon-webpack-plain', title: 'Webpack' },
  { devicon: 'devicon-jquery-plain', title: 'jQuery' },
  { devicon: 'devicon-bootstrap-plain', title: 'Bootstrap' },
];

const DevToolIcons = [
  { devicon: 'devicon-amazonwebservices-original', title: 'AWS' },
  { devicon: 'devicon-mysql-plain-wordmark', title: 'MySQL' },
  { devicon: 'devicon-git-plain', title: 'Git' },
  { devicon: 'devicon-postgresql-plain', title: 'postgreSQL' },
  { devicon: 'devicon-mongodb-plain', title: 'MongoDB' },
  { devicon: 'devicon-heroku-plain', title: 'Heroku' },
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
                I am capable of building a website that meets your needs. From small
                scale websites with a built-in CMS such as WordPress, to large
                scale websites that require a development team with both
                front-end and back-end engineers working together. With version
                control tool experience like github / bitbucket, and knowledge
                from my MS Computer Science degree, I am ready to work with
                other experienced developers since I care not only to get things to work,
                 but also work efficiently with high performance!
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
                <h5 className="card-title font-weight-bold">Languages</h5>
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
                <h5 className="card-title font-weight-bold">Dev Tools</h5>
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
