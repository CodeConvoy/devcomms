import Background from '../components/Background.js';
import Router from 'next/router';
import Link from 'next/link';

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
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
        <hr />
        <Link href="/signin">
          <a>Back to sign in</a>
        </Link>
      </div>
    </div>
  );
}
