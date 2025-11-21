import React from 'react';
import VerdeSaberContent from '../components/content/VerdeSaberContent';
import Header from '../components/Header';
import Footer from '../components/Footer';

const VerdeSaber = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4">
        <VerdeSaberContent />
      </main>
      <Footer />
    </div>
  );
};

export default VerdeSaber;
