import { useState } from 'react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        signUp();
      }}>
        <h2>Sign Up</h2>
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          placeholder="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <label htmlFor="signup-username">Username</label>
        <input
          id="signup-username"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          placeholder="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <input
          id="signup-confirmpassword"
          placeholder="confirm password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <button>Sign Up</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
