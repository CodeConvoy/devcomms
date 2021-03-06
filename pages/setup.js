import Loading from '../components/Loading.js';
import Background from '../components/Background.js';
import Router from 'next/router';
import Snackbar from '../components/Snackbar.js';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import getError from '../util/getError.js';

import styles from '../styles/pages/Setup.module.css';

export default function SignUp(props) {
  const { authed, currentUser } = props;

  const [username, setUsername] = useState('');

  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  // attempts to create user
  async function createUser() {
    setIsError(false);
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
    const usernameLower = username.toLowerCase();
    const usernamesRef = firebase.firestore().collection('usernames');
    const usernameRef = usernamesRef.doc(usernameLower);
    const usernameDoc = await usernameRef.get();
    if (usernameDoc.exists) {
      setError("Username is taken. Please try another.");
      setIsError(true);
      return;
    }
    // create user documents
    const { uid, photoURL } = firebase.auth().currentUser;
    const userRef = firebase.firestore().collection('users').doc(uid);
    await userRef.set({ photo: photoURL, username, friends: [] });
    await usernameRef.set({ uid, username, usernameLower, photo: photoURL });
  }

  // on error closed
  function onCloseError(event, reason) {
    if (reason !== 'clickaway') setIsError(false);
  }

  // listen for user auth
  useEffect(() => {
    if (currentUser) Router.push('/home');
    else if (!authed) Router.push('/');
  }, [authed, currentUser]);

  // return if loading
  if (!authed || currentUser) return <Loading />;

  return (
    <div className={styles.container}>
      <Background />
      <div className={styles.center}>
        <h1>New User</h1>
        <hr />
        <form onSubmit={e => {
          e.preventDefault();
          createUser();
        }}>
          <label>
            Username<br />
            <input
              id="signup-username"
              className="darkinput"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <button className="bluebutton">Create</button>
        </form>
        <Snackbar
          type="error"
          message={error}
          open={isError}
          setOpen={setIsError}
        />
      </div>
    </div>
  );
}
