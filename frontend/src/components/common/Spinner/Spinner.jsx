import './Spinner.css';

const Spinner = ({ size = 'medium', text = '', fullScreen = false }) => {
    const SpinnerContent = () => (
        <div className={`spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
            <div className={`spinner spinner-${size}`}>
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
                <div className="spinner-circle"></div>
            </div>
            {text && <p className="spinner-text">{text}</p>}
        </div>
    );

    return <SpinnerContent />;
};

export default Spinner;
