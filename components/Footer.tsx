
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 mt-12 py-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="space-y-4">
          {/* Main content */}
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">
              Deutscher Grammatik- und Rechtschreibprüfer
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          {/* Powered by section */}
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
            <span>Powered by</span>
            <span className="font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Google Gemini AI
            </span>
          </div>

          {/* Copyright */}
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} Alle Rechte vorbehalten.
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
    </footer>
  );
};

export default Footer;
