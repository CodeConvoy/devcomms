import Router from 'next/router';

import firebase from 'firebase/app';

// signs user in with github
export default async function signInWithGitHub() {
  const provider = new firebase.auth.GithubAuthProvider();
  await firebase.auth().signInWithPopup(provider);
  Router.push('/home');
}
