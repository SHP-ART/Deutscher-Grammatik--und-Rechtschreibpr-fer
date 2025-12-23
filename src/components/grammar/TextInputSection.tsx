import React from 'react';

interface TextInputSectionProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  characterCount: number;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
  value,
  onChange,
  disabled,
  characterCount
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 flex justify-between items-center">
        <label htmlFor="input-text" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Text eingeben
        </label>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {characterCount.toLocaleString('de-DE')} Zeichen
        </span>
      </div>
      <textarea
        id="input-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Text hier eingeben..."
        className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder:text-gray-400 transition-all shadow-sm hover:shadow-md"
        disabled={disabled}
      />
    </div>
  );
};

export default TextInputSection;
