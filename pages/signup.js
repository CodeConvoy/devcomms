import Loading from '../components/Loading.js';
import Background from '../components/Background.js';
import Router from 'next/router';
import Link from 'next/link';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import getError from '../util/getError.js';

import styles from '../styles/pages/SignUp.module.css';

export default function SignUp(props) {
  const { currentUser } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  // attempts to sign up user
  async function signUp() {
    setIsError(false);
    // verify password confirmation
    if (password !== confirmPassword) {
      setError("Passwords must match.");
      setIsError(true);
      return;
    }
    // verify username chars
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      setError("Username can only contain alphanumeric characters and underscore.");
      setIsError(true);
      return;
    }
    // verify username length
    if (username.length < 2 || username.length > 16) {
      setError("Username must be between 2 and 16 characters.");
      setIsError(true);
      return;
    }
    // verify username availability
    const usernameRef = firebase.firestore().collection('usernames').doc(username);
    const usernameDoc = await usernameRef.get();
    if (usernameDoc.exists) {
      setError("Username is taken. Please try another.");
      setIsError(true);
      return;
    }
    // create user account
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    // fail to create user
    } catch (e) {
      setError(getError(e));
      setIsError(true);
      return;
    };
    // create user documents
    const uid = firebase.auth().currentUser.uid;
    const userRef = firebase.firestore().collection('users').doc(uid);
    await userRef.set({ username });
    await usernameRef.set({ username, uid, joined: new Date() });
  }

  // on error closed
  function onCloseError(event, reason) {
    if (reason !== 'clickaway') setIsError(false);
  }

  // listen for user auth
  useEffect(() => {
    if (currentUser) Router.push('/home');
  }, [currentUser]);

  // return if loading
  if (currentUser) return <Loading />;

  return (
    <div className="page-container">
      <Background />
      <div className="page-center">
        <h1>Sign Up</h1>
        <hr />
        <form onSubmit={e => {
          e.preventDefault();
          signUp();
        }}>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            className="darkinput"
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
            className="darkinput"
            placeholder="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            className="darkinput"
            placeholder="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <input
            id="signup-confirmpassword"
            className="darkinput"
            placeholder="confirm password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button className="bluebutton">Sign Up</button>
        </form>
        <hr />
        <Link href="/signin">
          <a>Have an account? Sign in</a>
        </Link>
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          onClose={onCloseError}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={onCloseError}
            severity="error"
          >
            {error}
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
}
