import Header from './components/Header/Header.jsx';
import ScrollUpBtn from './components/ScrollUpBtn/ScrollUpBtn.jsx';
import Carousel from './components/Carousel/Carousel.jsx';
import About from './components/About/About.jsx';
import Projects from './components/Projects/Projects.jsx';
import Skills from './components/Skills/Skills.jsx';
import Contact from './components/Contact/Contact.jsx';
import ResumeModal from './components/ResumeModal/ResumeModal.jsx';
import useResumeModal from './hooks/useResumeModal.js';

function App() {
  const { isOpen, open, close } = useResumeModal();

  return (
    <div>
      <Header onOpenResume={open} />
      <ScrollUpBtn />
      <Carousel />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <ResumeModal isOpen={isOpen} onClose={close} />
    </div>
  );
}

export default App;
