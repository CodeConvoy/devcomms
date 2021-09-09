import Loading from '../components/Loading.js';
import Background from '../components/Background.js';
import Router from 'next/router';

import firebase from 'firebase/app';
import { useEffect } from 'react';

import styles from '../styles/pages/SignIn.module.css';

export default function SignIn(props) {
  const { currentUser } = props;

  // creates user doc if not existing
  async function createUserDoc() {
    // get user doc
    const uid = firebase.auth().currentUser.uid;
    const usersRef = firebase.firestore().collection('users');
    const userDoc = usersRef.doc(uid);
    // if no user doc exists, create one
    if (!userDoc.exists) {
      usersRef.doc(uid).set({ username: uid, friends: [] });
    }
  }

  // signs user in with github
  async function signInWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    await firebase.auth().signInWithPopup(provider);
    await createUserDoc();
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
        <h1>Sign In</h1>
        <hr />
        <button
          onClick={signInWithGitHub}
          className="bluebutton"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
