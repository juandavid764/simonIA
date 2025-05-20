import { Navbar } from "../components/home/Navbar";
import { Hero } from "../components/home/Hero";
import { Register } from "../components/home/Register";
import { WhatIs } from "../components/home/WhatIs";
import { Examples } from "../components/home/Examples";
import { Demo } from "../components/home/Demo";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main>
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
};
