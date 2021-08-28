import Image from 'next/image';
import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/components/Header.module.css';

export default function Header(props) {
  const { currentUser } = props;

  return (
    <div className={styles.container}>
      <Image src="/logo.png" width="48" height="48" alt="logo" />
      <h1>Devcomms</h1>
      <span className={styles.flexfill} />
      <p>Signed in as {currentUser.username}</p>
      <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
    </div>
  );
}
