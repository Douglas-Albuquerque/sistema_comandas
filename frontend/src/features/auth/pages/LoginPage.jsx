import LoginForm from '../components/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-circle circle-1"></div>
        <div className="login-circle circle-2"></div>
        <div className="login-circle circle-3"></div>
      </div>
      <div className="login-content">
        <LoginForm />
        <div className="login-footer-outside">
          <p>HS Tecnologia 2025®</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
