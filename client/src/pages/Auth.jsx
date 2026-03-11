import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'designer' // Automatically sets role so they appear on the Hire page
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: 'Processing...', type: 'info' });

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(` https://gallery-art-api.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // IMPORTANT: Save these so ProtectedRoute can see them
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        navigate('/dashboard');
      } else {
        setMessage({ text: data.message || 'Authentication failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Server is offline. Check terminal.', type: 'error' });
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '80px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>{isLogin ? 'Designer Login' : 'Create Designer Account'}</h2>
      
      {message.text && (
        <div style={{ color: message.type === 'error' ? 'red' : 'blue', marginBottom: '10px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <input 
            type="text" 
            name="fullName" 
            placeholder="Full Name" 
            onChange={handleChange} 
            required 
          />
        )}
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        
        <button type="submit" style={{ padding: '10px', background: '#000', color: '#fff', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Sign Up as Designer'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        {isLogin ? "New designer?" : "Already have an account?"} 
        <span 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
        >
          {isLogin ? 'Create account here' : 'Login here'}
        </span>
      </p>
    </div>
  );
};

export default Auth;