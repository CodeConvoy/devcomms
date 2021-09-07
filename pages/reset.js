import Background from '../components/Background.js';
import Router from 'next/router';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import getError from '../util/getError.js';

import styles from '../styles/pages/Reset.module.css';

export default function Reset(props) {
  const { currentUser } = props;

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // sends password reset email
  async function resetPassword() {
    setError('');
    setSuccess('');
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setSuccess(`Email sent to ${email}`);
    } catch (e) {
      setError(getError(e));
    }
  }

  // listen for user auth
  useEffect(() => {
    if (currentUser) Router.push('/home');
  }, [currentUser]);

  return (
    <div className={styles.container}>
      <Background />
      <div className={styles.center}>
        <h1>Reset<br />Password</h1>
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
          <button className="bluebutton">Reset Password</button>
        </form>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </div>
    </div>
  );
}
