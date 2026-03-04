import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // NORMALIZE: Ensure email is lowercase and has no accidental spaces
    const cleanEmail = formData.email.toLowerCase().trim();
    const userKey = `designer_${cleanEmail}`;

    if (isRegistering) {
      // --- JOIN LOGIC ---
      if (localStorage.getItem(userKey)) {
        setError("An account with this email already exists.");
        return;
      }
      
      const newUser = {
        fullName: formData.fullName.trim(),
        email: cleanEmail,
        password: formData.password // Password remains case-sensitive
      };

      localStorage.setItem(userKey, JSON.stringify(newUser));
      alert("Account created successfully! Please Sign In.");
      setIsRegistering(false);
    } else {
      // --- SIGN IN LOGIC ---
      const savedData = localStorage.getItem(userKey);

      if (!savedData) {
        setError("No account found. Please 'Join as a Designer' first.");
        return;
      }

      const user = JSON.parse(savedData);

      // Verify password
      if (user.password === formData.password) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Use replace: true to fix the "Back" button loop
        navigate('/dashboard', { replace: true });
      } else {
        setError("Wrong password. Please check your spelling and Caps Lock.");
      }
    }
  };

  return (
    <div className="auth-container-full">
      <div className="auth-card-modern">
        <h2>{isRegistering ? "Join as a Designer" : "Welcome Back"}</h2>
        <p className="auth-subtitle">
          {isRegistering ? "Create your professional gallery profile" : "Sign in to manage your portfolio"}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                placeholder="Josephine Antwi" 
                required 
                onChange={handleChange} 
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="designer@example.com" 
              required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="••••••••" 
                required 
                onChange={handleChange} 
              />
              <button 
                type="button" 
                className="toggle-eye" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <button type="submit" className="btn-auth-primary">
            {isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegistering ? "Already have an account?" : "New to the platform?"}
          <button 
            type="button" 
            className="link-btn" 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          >
            {isRegistering ? " Sign In" : " Join as a Designer"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;