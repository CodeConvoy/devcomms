import Router from 'next/router';

import firebase from 'firebase/app';

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
export default async function signInWithGitHub() {
  const provider = new firebase.auth.GithubAuthProvider();
  await firebase.auth().signInWithPopup(provider);
  Router.push('/home');
  await createUserDoc();
}
