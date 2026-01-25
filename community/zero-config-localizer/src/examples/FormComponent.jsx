/**
 * React component example.
 *
 * @returns {JSX.Element}
 */

import { useState } from 'react';

export default function FormComponent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    alert('Form submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Newsletter Signup</h3>
      <p>Stay updated with our latest news and offers</p>
      
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <span style={{ color: 'red' }}>{error}</span>}
      </div>

      <button type="submit">Subscribe Now</button>
      
      <p>
        By subscribing, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}

// Everything gets translated automatically:
// - Form labels: "Email Address"
// - Placeholders: "Enter your email"  
// - Buttons: "Subscribe Now"
// - Error messages: "Please enter a valid email address"
// - Help text: "Stay updated with our latest news and offers"
// - Legal text: "By subscribing, you agree to our..."
//
// The form logic, event handlers, and state management stay exactly the same!
