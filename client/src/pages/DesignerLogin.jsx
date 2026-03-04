import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const DesignerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    bio: '',
    instagram: '',
    behance: '',
    snapchat: '',
    twitter: '',
    facebook: '',
    portfolio: [],
    reviews: []
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      let payload;
      if (isLogin) {
        payload = { email: form.email, password: form.password };
      } else {
        payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          contact: form.contact,
          bio: form.bio,
          socials: {
            instagram: form.instagram,
            behance: form.behance,
            snapchat: form.snapchat,
            twitter: form.twitter,
            facebook: form.facebook
          },
          portfolio: form.portfolio,
          reviews: form.reviews
        };
      }
      const res = await axios.post(url, payload);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/';
      } else {
        setIsLogin(true);
        setForm({
          name: '',
          email: '',
          password: '',
          contact: '',
          instagram: '',
          behance: '',
          snapchat: '',
          twitter: '',
          facebook: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="designer-auth-sidebar">
      <div className="designer-auth-info">
        <h2>Are you a graphic designer?</h2>
        <p>Want to show your work? Create an account and start posting your designs!</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>{isLogin ? 'Designer Login' : 'Designer Register'}</h3>
        {!isLogin && (
          <>
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input type="text" name="contact" placeholder="Contact (email or phone)" value={form.contact} onChange={handleChange} />
            <textarea name="bio" placeholder="Short bio/about you" value={form.bio} onChange={handleChange} />
            <input type="text" name="instagram" placeholder="Instagram URL" value={form.instagram} onChange={handleChange} />
            <input type="text" name="behance" placeholder="Behance URL" value={form.behance} onChange={handleChange} />
            <input type="text" name="snapchat" placeholder="Snapchat URL" value={form.snapchat} onChange={handleChange} />
            <input type="text" name="twitter" placeholder="Twitter URL" value={form.twitter} onChange={handleChange} />
            <input type="text" name="facebook" placeholder="Facebook URL" value={form.facebook} onChange={handleChange} />
            {/* Portfolio and reviews can be added after registration via profile editing */}
          </>
        )}
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        <div className="auth-toggle">
          {isLogin ? (
            <span>New designer? <button type="button" onClick={() => setIsLogin(false)}>Register</button></span>
          ) : (
            <span>Already have an account? <button type="button" onClick={() => setIsLogin(true)}>Login</button></span>
          )}
        </div>
      </form>
    </div>
  );
};

export default DesignerLogin;
