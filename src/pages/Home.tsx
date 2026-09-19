import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PortfolioSections from '../components/PortfolioSections';
import Contact from '../components/Contact';
import Footer from '../components/ManagedFooter';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-dark">
      <Navbar />
      <main>
        <Hero />
        <PortfolioSections />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
