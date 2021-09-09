import Background from '../components/Background.js';

import firebase from 'firebase/app';

import styles from '../styles/pages/SignIn.module.css';

export default function SignIn() {
  async function signInWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  }

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
