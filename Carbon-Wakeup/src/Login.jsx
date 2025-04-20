import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './Login.css';

const Login = () => {
  const [signIn, setSignIn] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.authenticated) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userId = uuidv4(); // Generate UUID for user ID
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // Using generated UUID
          userType: 'regular',
          email: signupEmail,
          password: signupPassword,
          name: signupName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto-login after successful registration
      const loginResponse = await fetch('/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword
        }),
      });

      const loginData = await loginResponse.json();

      if (loginData.authenticated) {
        localStorage.setItem('user', JSON.stringify(loginData.user));
        window.location.href = '/';
      } else {
        setSignIn(true);
        setLoginEmail(signupEmail);
        setError('Account created. Please sign in.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header/Navbar */}
      <div className="header">
        <h1 className="navbar-brand">Login</h1>
        <nav className="navigation">
          <ul className="nav-list">
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/compare">Compare Carbon Emissions</Link></li>
            <li><Link to="/calculator">Carbon Footprint Calculator</Link></li>
            <li><Link to="/donate">Donate</Link></li>
          </ul>
        </nav>
      </div>

      {/* Login/Signup container */}
      <div className={`login-signup-container ${signIn ? 'sign-in-mode' : 'sign-up-mode'}`}>
        {/* Sign Up Form */}
        <div className="signup-form-container">
          <form className="signup-form" onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input 
              className="signup-input" 
              type="text" 
              placeholder="Name" 
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
            />
            <input 
              className="signup-input" 
              type="email" 
              placeholder="Email" 
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <input 
              className="signup-input" 
              type="password" 
              placeholder="Password" 
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              minLength="6"
              required
            />
            {error && !signIn && <div className="error-message">{error}</div>}
            <button 
              className="signup-button" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <p className="toggle-form">
              Already have an account?{' '}
              <span onClick={() => setSignIn(true)}>Sign In</span>
            </p>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <input 
              className="login-input" 
              type="email" 
              placeholder="Email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input 
              className="login-input" 
              type="password" 
              placeholder="Password" 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <a href="#" className="login-forgot-password">Forgot your password?</a>
            {error && signIn && <div className="error-message">{error}</div>}
            <button 
              className="login-button" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            <p className="toggle-form">
              Don't have an account?{' '}
              <span onClick={() => setSignIn(false)}>Sign Up</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;