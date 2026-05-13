import React from 'react';

/**
 * Props interface for the Button component.
 * title: The text to display on the button.
 * onPress: The callback function triggered on click.
 * variant: 'primary' for solid blue, 'secondary' for the light blue tint.
 * disabled: Boolean to disable interaction.
 */
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
  
  // Design constants based on VideoPreview.tsx and Courses.tsx styles
  const primaryBg = 'rgb(25, 42, 86)'; // Deep navy blue
  const secondaryBg = 'rgba(165, 190, 252, 0.197)'; // Light blue tint
  const textColor = variant === 'primary' ? '#FBFCF8' : 'rgb(25, 42, 86)';

  const buttonStyle: React.CSSProperties = {
    backgroundColor: disabled ? '#ccc' : (variant === 'primary' ? primaryBg : secondaryBg),
    padding: '10px 20px',
    borderRadius: '8px',
    border: variant === 'secondary' ? `1px solid ${primaryBg}` : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Inter, sans-serif', // Matching Inter_24pt-Regular
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