import firebase from 'firebase/app';

export default function SignIn() {
  async function signInWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  }

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={signInWithGitHub}>Sign in with GitHub</button>
    </div>
  );
}
