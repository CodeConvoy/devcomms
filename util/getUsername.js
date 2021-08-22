import firebase from 'firebase/app';

// returns username with given uid
export default async function getUsername(uid) {
  const usersRef = firebase.firestore().collection('users');
  const userRef = usersRef.doc(uid);
  const userDoc = await userRef.get();
  return userDoc.exists ? userDoc.data().username : undefined;
}
