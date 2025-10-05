
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-5 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-600">
          Deutscher Grammatik- und Rechtschreibprüfer
        </h1>
        <p className="text-slate-500 mt-1">
          Powered by Google Gemini
        </p>
      </div>
    </header>
  );
};

export default Header;
