import DownloadCvButton from '../About/DownloadCvButton.jsx';

const EMAIL = 'elvislee0725@gmail.com';

function ResumeModal({ isOpen, onClose }) {
  return (
    <div className={`resume-modal${isOpen ? ' resume-modal--is-visible' : ''}`}>
      <div className="container resume-modal__container">
        <div className="row">
          <div className="col-12 col-sm-4">
            <section className="mb-4">
              <h3>ELVIS LEE</h3>
              <hr />
              <p>
                <i className="fas fa-map-marker-alt fa-fw"></i>&nbsp;Irvine, CA
                <br />
                <i className="far fa-envelope fa-fw"></i>
                &nbsp;
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <br />
              </p>
              <hr />
            </section>

            <section className="mb-5">
              <h5>TECHNICAL SKILLS</h5>
              <div>
                <p>
                  <b>Languages &amp; Databases</b> <br />
                  Java, Python, JavaScript, PHP, PostgreSQL, MySQL, MongoDB,
                  Redis, Elasticsearch
                </p>
              </div>
              <div>
                <p>
                  <b>Frameworks &amp; APIs</b> <br />
                  Spring Boot, Spring Security, React, Node.js, Redux, JavaFX,
                  REST, GraphQL, FastAPI
                </p>
              </div>
              <div>
                <p>
                  <b>Cloud &amp; DevOps</b> <br />
                  GCP (BigQuery, Dataflow, Cloud Storage), AWS (EC2, S3, IAM),
                  Kubernetes, Docker, GKE Enterprise, Jenkins, Vault, JFrog
                  Artifactory, Apigee
                </p>
              </div>
              <div>
                <p>
                  <b>Testing, Tools &amp; Others</b> <br />
                  JUnit, Cucumber, JMeter, SonarQube, Veracode, Postman, Kafka,
                  IntelliJ IDEA, VS Code, Git, PagerDuty, Nginx
                </p>
              </div>
            </section>

            <section className="mb-5">
              <h5>EDUCATION</h5>
              <div>
                <p>
                  <b>University of Southern California</b>
                  <span className="float-right">Los Angeles, CA, USA</span>
                  <br />
                  Master of Science in Computer Science
                </p>
              </div>
            </section>
          </div>
          <div className="col-12 col-sm-8">
            <section className="mb-5">
              <h5>PROFESSIONAL EXPERIENCE</h5>
              <div>
                <p>
                  <b>Cotality</b>
                  <span className="float-right">Irvine, CA, USA</span>
                  <br />
                  Software Engineer
                  <i>
                    <span className="float-right">October 2021 – present</span>
                  </i>
                </p>
                <p>
                  <b>AI-Powered Search / Semantic Platform</b>
                </p>
                <ul>
                  <li>
                    Improved the semantic layer query relevance and accuracy
                    (~30%) by refining entity mapping and relationship
                    resolution across distributed data sources
                  </li>
                  <li>
                    Developed a semantic layer microservice using Python,
                    FastAPI, and Redis to translate natural-language prompts
                    into structured, graph-based queries over business data
                  </li>
                  <li>
                    Designed and implemented an intent interpretation pipeline
                    leveraging NLU and semantic parsing to bridge unstructured
                    user input with structured data models for semantic layer
                  </li>
                </ul>
                <p>
                  <b>DataAPI Team</b>
                </p>
                <ul>
                  <li>
                    Engineered a unified GraphQL API (Java, Spring Boot, DGS)
                    to consolidate 12+ REST services across property data
                    domains, reducing client-side API orchestration and
                    improving query flexibility and developer efficiency by
                    50%+
                  </li>
                  <li>
                    Designed and optimized GraphQL schema and resolver
                    patterns using domain-driven design principles to enable
                    efficient data aggregation and low-latency query execution
                    across distributed services
                  </li>
                </ul>
                <p>
                  <b>Additional Engineering Impact</b>
                </p>
                <ul>
                  <li>
                    Transformed manual Postman regression tests for 16 APIs
                    into an automated Jenkins job for daily monitoring,
                    eliminating manual test execution and saving roughly 4 - 5
                    engineer hours per week
                  </li>
                  <li>
                    Automated Veracode scans for 20+ apps and library
                    artifacts with Jenkins, integrating Slack alerts to
                    immediately report security findings, reducing manual
                    security reviews by over 70% and improving incident
                    response times
                  </li>
                  <li>
                    Improved API scalability and performance by conducting
                    load testing and tuning, supporting 10,000 concurrent
                    requests and reducing latency by 25%
                  </li>
                  <li>
                    Developed Python automation tool to generate GCP BigQuery
                    schemas and Dataflow configurations, automating manual
                    updates to cloud config files across multiple
                    environments, to reduce configuration time by over 80%
                  </li>
                </ul>
              </div>
              <div>
                <p>
                  <b>PalPilot International Corp.</b>
                  <span className="float-right">Tustin, CA, USA</span>
                  <br />
                  Software Engineer
                  <i>
                    <span className="float-right">
                      January 2016 – September 2021
                    </span>
                  </i>
                </p>
                <ul>
                  <li>
                    Owned development of a full-stack job application platform
                    (React, Node.js, PostgreSQL), driving 5–10 monthly
                    applicants and reducing recruiting costs by $2K+ annually
                  </li>
                  <li>
                    Implemented an event-driven email notification system
                    (JavaScript, SendGrid API) for user inquiries and quote
                    requests, improving sales response times by 50%+
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
        <DownloadCvButton />
      </div>
      <div className="resume-modal__close" onClick={onClose}>
        X
      </div>
    </div>
  );
}

export default ResumeModal;
