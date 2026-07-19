import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Fasilitas from './components/Fasilitas';
import UMKMDirectory from './components/UMKMDirectory';
import MapSection from './components/MapSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Fasilitas />
        <UMKMDirectory />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
