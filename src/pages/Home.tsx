import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Showreel from '../components/Showreel';
import Projects from '../components/Projects';
import ContentCreator from '../components/ContentCreator';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark">
      <Navbar />
      <main>
        <Hero />
        <Showreel />
        <Projects />
        <ContentCreator />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
