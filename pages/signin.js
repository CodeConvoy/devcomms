import { useState } from 'react';
import firebase from 'firebase/app';

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
      if (e.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (e.code === 'auth/user-not-found') {
        setError('Unknown email address.');
      } else if (e.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (e.code === 'auth/too-many-requests') {
        setError('Too many sign in requests. Please try again later.')
      } else if (e.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError(e.message);
      }
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
