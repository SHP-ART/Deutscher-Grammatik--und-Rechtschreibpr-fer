import React, { useState, useEffect } from 'react';
import { correctGrammar } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ClipboardIcon from './components/icons/ClipboardIcon';
import CheckIcon from './components/icons/CheckIcon';
import SetupPage from './components/SetupPage';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [needsSetup, setNeedsSetup] = useState<boolean>(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState<boolean>(true);
  const [toUpperCase, setToUpperCase] = useState<boolean>(false);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await fetch('/api/setup/status');
        const data = await response.json();
        setNeedsSetup(data.needsSetup);
      } catch (err) {
        console.error('Error checking setup status:', err);
      } finally {
        setIsCheckingSetup(false);
      }
    };
    
    checkSetupStatus();
  }, []);

  if (isCheckingSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (needsSetup) {
    return <SetupPage onSetupComplete={() => setNeedsSetup(false)} />;
  }

  const handleGrammarCheck = () => {
    if (!inputText.trim()) {
      setError('Bitte geben Sie einen Text ein.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCorrectedText('');

    correctGrammar(inputText)
      .then(result => {
        setCorrectedText(toUpperCase ? result.toUpperCase() : result);
      })
      .catch(err => {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCopy = () => {
    if (correctedText) {
      navigator.clipboard.writeText(correctedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-slate-800 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 -mt-6 relative z-20">
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 space-y-8 border border-white/50 animate-fade-in">
          {/* Title Section with Icon */}
          <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">
              Geben Sie Ihren Text zur Überprüfung ein
            </h2>
            <p className="text-slate-500 text-sm">Automatische Korrektur von Grammatik und Rechtschreibung</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[450px]">
            {/* Input Section */}
            <div className="flex flex-col group">
              <div className="mb-3 flex justify-between items-center">
                <label htmlFor="input-text" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Originaltext
                </label>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {inputText.length} Zeichen
                </span>
              </div>
              <div className="relative flex-1">
                <textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Schreiben Sie hier Ihren Text..."
                  className="w-full h-full p-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 resize-none bg-gradient-to-br from-white to-slate-50 disabled:bg-slate-200 disabled:cursor-not-allowed shadow-inner text-slate-800 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-lg font-medium">
                    Eingabebereich
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col group">
              <div className="mb-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Korrigierter Text
                </span>
                {correctedText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-white bg-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 border border-slate-200 hover:border-transparent rounded-full transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105"
                    aria-label="Korrektur kopieren"
                  >
                    {isCopied ? (
                      <>
                        <CheckIcon className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-4 w-4" />
                        <span>Kopieren</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="relative flex-1">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50/90 to-purple-50/90 backdrop-blur-md z-10 rounded-2xl border-2 border-indigo-200">
                    <LoadingSpinner />
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-6 z-10 rounded-2xl border-2 border-red-200 animate-fade-in">
                    <div className="text-center space-y-2">
                      <div className="inline-block p-3 bg-red-100 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                  </div>
                )}
                <div className="h-full w-full p-5 border-2 border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 to-white overflow-y-auto shadow-inner">
                  <pre className="whitespace-pre-wrap break-words font-sans text-slate-800 leading-relaxed">
                    {correctedText || (
                      <span className="text-slate-400 italic flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Die Korrektur wird hier angezeigt...
                      </span>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={toUpperCase}
                onChange={(e) => setToUpperCase(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-all"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                Ausgabe in GROSSBUCHSTABEN
              </span>
            </label>
          </div>

          {/* Action Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleGrammarCheck}
              disabled={isLoading || !inputText}
              className="relative px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:transform-none overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Prüfung läuft...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Grammatik prüfen
                  </>
                )}
              </span>
              {!isLoading && !(!inputText) && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;