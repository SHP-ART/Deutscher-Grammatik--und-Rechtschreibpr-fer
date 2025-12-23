import React from 'react';

interface SetupFormProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
  success: string;
}

const SetupForm: React.FC<SetupFormProps> = ({
  apiKey,
  onApiKeyChange,
  onSubmit,
  isLoading,
  error,
  success
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-2">
          Google Gemini API Key
        </label>
        <input
          type="text"
          id="apiKey"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="AIza..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 font-mono text-sm"
          disabled={isLoading}
          autoFocus
        />
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-2">
            🔑 Wo bekomme ich einen API Key?
          </p>
          <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
            <li>
              Gehe zu{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 underline font-semibold"
              >
                Google AI Studio → API Keys
              </a>
            </li>
            <li>Klicke auf "Create API Key"</li>
            <li>Wähle ein Google Cloud Projekt (oder erstelle ein neues)</li>
            <li>Kopiere den generierten API Key hierher</li>
          </ol>
          <p className="text-xs text-blue-700 mt-2">
            💡 Der API Key ist kostenlos für die ersten Anfragen!
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !apiKey.trim()}
        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Wird getestet und gespeichert...
          </span>
        ) : (
          'API Key speichern & testen'
        )}
      </button>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Was passiert?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• Dein API Key wird getestet</li>
          <li>• Bei Erfolg wird er in der <code className="bg-blue-100 px-1 rounded">.env</code> Datei gespeichert</li>
          <li>• Der Key bleibt nur auf deinem Server</li>
          <li>• Du kannst die App danach sofort nutzen</li>
        </ul>
      </div>
    </form>
  );
};

export default SetupForm;
