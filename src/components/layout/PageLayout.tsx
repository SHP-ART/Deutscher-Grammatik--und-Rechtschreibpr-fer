import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 max-w-6xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
