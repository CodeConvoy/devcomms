import { useState } from 'react';
import firebase from 'firebase/app';
import getError from '../util/getError.js';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // attempts to sign in user
  async function signIn() {
    setError('');
    // try to sign in with email and password
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    // handle sign in error
    } catch (e) {
      setError(getError(e));
    }
  }

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={e => {
        e.preventDefault();
        signIn();
      }}>
        <label htmlFor="signin-email">Email</label>
        <input
          id="signin-email"
          placeholder="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <label htmlFor="signin-password">Password</label>
        <input
          id="signin-password"
          placeholder="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button>Sign In</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
