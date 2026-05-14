import React from 'react';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  type = 'button'
}) => {

  const primaryBg = 'rgb(25, 42, 86)';
  const secondaryBg = 'rgba(165, 190, 252, 0.197)';
  const textColor = variant === 'primary' ? '#FBFCF8' : 'rgb(25, 42, 86)';

  const buttonStyle: React.CSSProperties = {
    backgroundColor: disabled ? '#ccc' : (variant === 'primary' ? primaryBg : secondaryBg),
    padding: '10px 20px',
    borderRadius: '8px',
    border: variant === 'secondary' ? `1px solid ${primaryBg}` : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Inter, sans-serif', 
    fontWeight: '700',
    fontSize: '15px',
    color: textColor,
    transition: 'opacity 0.2s ease',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    outline: 'none',
  };

  return (
    <button 
      type={type}
      style={buttonStyle} 
      onClick={onPress} 
      disabled={disabled}
      onMouseOver={(e) => !disabled && (e.currentTarget.style.opacity = '0.8')}
      onMouseOut={(e) => !disabled && (e.currentTarget.style.opacity = '1')}
    >
      {title}
    </button>
  );
};