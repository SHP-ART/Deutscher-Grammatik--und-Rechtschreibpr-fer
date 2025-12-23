
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-12 py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full animate-pulse"></div>
          <p className="text-xs text-gray-600 font-medium">
            Textassistent
          </p>
        </div>
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Alle Rechte vorbehalten
        </p>
      </div>
    </footer>
  );
};

export default Footer;
