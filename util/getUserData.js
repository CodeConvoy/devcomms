import firebase from 'firebase/app';

// returns user data with given username
export default async function getUserData(username) {
  // get all users with matching username
  const usersRef = firebase.firestore().collection('users');
  const usersQuery = usersRef.where('username', '==', username);
  const users = await usersQuery.get();
  if (!users.docs.length) return null; // if no matches, return null
  // return first user data match
  const userDoc = users.docs[0];
  return { ...userDoc.data(), id: userDoc.id };
}
