import Router from 'next/router';

import firebase from 'firebase/app';

// prompts user for username
async function getUsername() {
  const usernamesRef = firebase.firestore().collection('usernames');
  let username;
  // prompt user while username invalid
  while (!username) {
    username = window.prompt('Enter a username');
    // verify username existence
    if (!username) {
      alert("Please enter a username.");
    }
    // verify username chars
    else if (!/^[A-Za-z0-9_]+$/.test(username)) {
      alert("Username can only contain alphanumeric characters and underscore.");
      username = undefined;
    }
    // verify username length
    else if (username.length < 2 || username.length > 16) {
      alert("Username must be between 2 and 16 characters.");
      username = undefined;
    }
    // verify username availability
    else {
      const usernamesRef = firebase.firestore().collection('usernames');
      const usernameRef = usernamesRef.doc(username);
      const usernameDoc = await usernameRef.get();
      if (usernameDoc.exists) {
        alert("Username is taken. Please try another.");
        username = undefined;
      }
    }
  }
  return username;
}

// creates user doc if not existing
async function createUserDoc() {
  // get user doc
  const uid = firebase.auth().currentUser.uid;
  const usersRef = firebase.firestore().collection('users');
  const usernamesRef = firebase.firestore().collection('usernames');
  const userRef = usersRef.doc(uid);
  const userDoc = await userRef.get();
  // if no user doc exists, create one
  if (!userDoc.exists) {
    const username = await getUsername();
    usersRef.doc(uid).set({ username: username, friends: [] });
    usernamesRef.doc(username).set({ username: username, uid: uid });
  }
}

// signs user in with github
export default async function signInWithGitHub() {
  const provider = new firebase.auth.GithubAuthProvider();
  await firebase.auth().signInWithPopup(provider);
  Router.push('/home');
  await createUserDoc();
}
