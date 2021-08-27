import Loading from '../components/Loading.js';
import Router from 'next/router';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import getError from '../util/getError.js';

import styles from '../styles/pages/SignIn.module.css';

export default function SignIn(props) {
  const { currentUser } = props;

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

  // listen for user auth
  useEffect(() => {
    if (currentUser) Router.push('/home');
  }, [currentUser]);

  // return if loading
  if (currentUser) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1>Sign In</h1>
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
        <Link href="/signup">
          <a>No account? Sign up</a>
        </Link>
      </div>
    </div>
  );
}
