import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'designer' // Default to designer so they can post art
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); // Save the login session
        alert("Account created successfully!");
        navigate('/dashboard'); // Send them to their new dashboard
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server connection error');
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Create Designer Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Create Password" onChange={handleChange} required />
        
        <label>I am a:</label>
        <select name="role" onChange={handleChange}>
          <option value="designer">Designer (I want to post work)</option>
          <option value="user">Client (I want to hire designers)</option>
        </select>

        <button type="submit" style={{ padding: '10px', background: 'black', color: 'white' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;