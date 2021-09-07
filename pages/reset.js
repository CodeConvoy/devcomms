import Background from '../components/Background.js';
import Router from 'next/router';
import Link from 'next/link';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import getError from '../util/getError.js';

import styles from '../styles/pages/Reset.module.css';

export default function Reset(props) {
  const { currentUser } = props;

  const [email, setEmail] = useState('');

  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [success, setSuccess] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // sends password reset email
  async function resetPassword() {
    setIsError(false);
    setIsSuccess(false);
    // try to send email
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setSuccess(`Email sent to ${email}`);
      setIsSuccess(true);
    // fail to send email
    } catch (e) {
      setError(getError(e));
      setIsError(true);
    }
  }

  // on error closed
  function onCloseError(event, reason) {
    if (reason !== 'clickaway') setIsError(false);
  }

  // on success closed
  function onCloseSuccess(event, reason) {
    if (reason !== 'clickaway') setIsSuccess(false);
  }

  // listen for user auth
  useEffect(() => {
    if (currentUser) Router.push('/home');
  }, [currentUser]);

  return (
    <div className="page-container">
      <Background />
      <div className="page-center">
        <h1>Reset Password</h1>
        <hr />
        <form onSubmit={e => {
          e.preventDefault();
          resetPassword();
        }}>
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            className="darkinput"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button className="bluebutton">Request</button>
        </form>
        <hr />
        <Link href="/signin">
          <a>Back to sign in</a>
        </Link>
        <Snackbar
          open={isSuccess}
          autoHideDuration={6000}
          onClose={onCloseSuccess}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={onCloseSuccess}
            severity="success"
          >
            {success}
          </MuiAlert>
        </Snackbar>
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
