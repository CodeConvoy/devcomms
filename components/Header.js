import Image from 'next/image';
import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <div>
      <h1>Devcomms</h1>
      {
        firebase.auth().currentUser ?
        <button onClick={() => firebase.auth().signOut()}>Sign Out</button> :
        <>
          <Link href="/signin">
            <a>Sign In</a>
          </Link>
          <Link href="/signup">
            <a>Sign Up</a>
          </Link>
        </>
      }
    </div>
  );
}
