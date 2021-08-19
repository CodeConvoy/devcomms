import { useState } from 'react';
import firebase from 'firebase/app';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // attempts to sign up user
  async function signUp() {
    setError('');
    // verify password confirmation
    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }
    // verify username chars
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      setError("Username can only contain alphanumeric characters and underscore.");
      return;
    }
    // verify username length
    if (username.length < 2 || username.length > 16) {
      setError("Username must be between 2 and 16 characters.");
      return;
    }
    // create user account
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    // fail create user
    } catch (e) {
      setError(e.code);
      return;
    };
    // create user document
    const uid = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('users').doc(uid).set({
      username: username,
      uid: uid,
      joined: new Date()
    });
  }

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
