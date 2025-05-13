import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIs from './components/WhatIs';
import Examples from './components/Examples';
import Demo from './components/Demo';
import Register from './components/Register';
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main >
        <Hero />
        <Register />
        <WhatIs />
        <Examples />
        <Demo />
      </main>
      <footer className="bg-gray-800">
        <div className="container-custom py-12">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 SimonIA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
