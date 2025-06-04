import { Navbar } from "../components/home/Navbar";
import { Hero } from "../components/home/Hero";
import { Register } from "../components/home/Register";
import { WhatIs } from "../components/home/WhatIs";
import { Examples } from "../components/home/Examples";
import { Demo } from "../components/home/Demo";
import { Tips } from "../components/home/Tips";
import { Footer } from "../components/home/Footer";

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
        <Tips />      </main>
      <Footer />
    </div>
  );
};
