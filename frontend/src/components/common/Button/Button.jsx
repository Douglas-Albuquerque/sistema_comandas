import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-loader">Carregando...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
