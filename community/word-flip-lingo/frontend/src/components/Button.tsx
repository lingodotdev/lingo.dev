import React from 'react';
import './Button.css';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  disabled, 
  loading, 
  children, 
  className = '' 
}) => {
  return (
    <button 
      className={`custom-button ${loading ? 'loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="button-loader"></span>}
      <span className="button-content">{children}</span>
    </button>
  );
};

export default Button;
