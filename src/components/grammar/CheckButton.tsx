import React from 'react';
import Button from '../common/Button';
import { UI_TEXT } from '../../utils/constants';

interface CheckButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

const CheckButton: React.FC<CheckButtonProps> = ({ onClick, disabled, isLoading }) => {
  return (
    <div className="text-center pt-4">
      <Button
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
        variant="primary"
        size="large"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {UI_TEXT.CHECKING}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {UI_TEXT.CHECK_GRAMMAR}
          </>
        )}
      </Button>
    </div>
  );
};

export default CheckButton;
