import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
          required 
        />
        <button type="submit" style={{ padding: '10px', background: 'black', color: 'white' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;