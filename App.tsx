import React, { useState, useCallback } from 'react';
import { correctGrammar } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ClipboardIcon from './components/icons/ClipboardIcon';
import CheckIcon from './components/icons/CheckIcon';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleGrammarCheck = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Bitte geben Sie einen Text ein.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCorrectedText('');

    try {
      const result = await correctGrammar(inputText);
      setCorrectedText(result);
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleCopy = () => {
    if (correctedText) {
      navigator.clipboard.writeText(correctedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 text-center">
            Geben Sie Ihren Text zur Überprüfung ein
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="input-text" className="sr-only">Eingabetext</label>
              <textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Schreiben Sie hier Ihren Text..."
                className="w-full h-64 md:h-80 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none bg-slate-50 disabled:bg-slate-200 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
            </div>
            <div className="relative flex flex-col bg-slate-50 rounded-lg">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10 rounded-lg">
                  <LoadingSpinner />
                </div>
              )}
              {error && (
                 <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-4 z-10 rounded-lg">
                   <p className="text-red-600 font-medium text-center">{error}</p>
                 </div>
              )}
              <div className="relative w-full h-64 md:h-80 p-4 border border-slate-200 rounded-lg overflow-y-auto">
                <pre className="whitespace-pre-wrap break-words font-sans text-slate-800">
                    {correctedText || <span className="text-slate-400">Die Korrektur wird hier angezeigt...</span>}
                </pre>
                {correctedText && (
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition duration-200 text-slate-600 hover:text-slate-800"
                    aria-label="Korrektur kopieren"
                  >
                    {isCopied ? <CheckIcon className="h-5 w-5 text-green-600" /> : <ClipboardIcon className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={handleGrammarCheck}
              disabled={isLoading || !inputText}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? 'Prüfung läuft...' : 'Grammatik prüfen'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;