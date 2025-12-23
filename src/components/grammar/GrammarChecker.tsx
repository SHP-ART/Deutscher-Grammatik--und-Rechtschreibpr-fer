import React from 'react';
import PageLayout from '../layout/PageLayout';
import TextInputSection from './TextInputSection';
import TextOutputSection from './TextOutputSection';
import FormatOptions from './FormatOptions';
import CheckButton from './CheckButton';
import { useGrammarCheck } from '../../hooks/useGrammarCheck';
import { useClipboard } from '../../hooks/useClipboard';
import { useFormatOptions } from '../../hooks/useFormatOptions';

const GrammarChecker: React.FC = () => {
  const grammarCheck = useGrammarCheck();
  const clipboard = useClipboard();
  const formatOptions = useFormatOptions();

  const handleCheckGrammar = () => {
    grammarCheck.handleCheck(formatOptions.getFormatOptions(), formatOptions.toUpperCase);
  };

  return (
    <PageLayout>
      <div className="w-full bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 space-y-6 border border-white/30 animate-fade-in">

        {/* Input and Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[450px]">
          <TextInputSection
            value={grammarCheck.inputText}
            onChange={grammarCheck.setInputText}
            disabled={grammarCheck.isLoading}
            characterCount={grammarCheck.inputText.length}
          />

          <TextOutputSection
            text={grammarCheck.correctedText}
            isLoading={grammarCheck.isLoading}
            error={grammarCheck.error}
            onCopy={() => clipboard.copyToClipboard(grammarCheck.correctedText)}
            isCopied={clipboard.isCopied}
          />
        </div>

        {/* Format Options */}
        <FormatOptions
          selectedModel={formatOptions.selectedModel}
          onModelChange={formatOptions.setSelectedModel}
          toUpperCase={formatOptions.toUpperCase}
          onToUpperCaseChange={formatOptions.setToUpperCase}
          asEmail={formatOptions.asEmail}
          onEmailChange={formatOptions.toggleEmail}
          asInvoice={formatOptions.asInvoice}
          onInvoiceChange={formatOptions.toggleInvoice}
          withResearch={formatOptions.withResearch}
          onResearchChange={formatOptions.setWithResearch}
        />

        {/* Check Button */}
        <CheckButton
          onClick={handleCheckGrammar}
          disabled={!grammarCheck.inputText || grammarCheck.isLoading}
          isLoading={grammarCheck.isLoading}
        />
      </div>
    </PageLayout>
  );
};

export default GrammarChecker;
