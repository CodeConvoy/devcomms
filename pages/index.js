import Image from 'next/image';
import Link from 'next/link';

import firebase from 'firebase/app';

import styles from '../styles/pages/Index.module.css';

export default function Index() {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.title}>
          <h1>Devcomms</h1>
          <Image src="/logo.png" width="48" height="48" alt="logo" />
        </div>
        <p>Team communication and coordination all in one place.</p>
        <p>Devcomms is an open source, developer-focused team communication and
        coordination tool aiming to simplify and streamline group development.
        </p>
        <p>Instead of having one tool for chatting and calling, one tool for
        arranging notes, and one tool for setting goals and to-dos, you can do
        all of that and more with Devcomms. No longer will you have to struggle
        to coordinate across several apps.</p>
        {
          firebase.auth().currentUser ?
          <Link href="/home">Home</Link> :
          <>
            <Link href="/signin">
              <a>Sign In</a>
            </Link>
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </>
        }
        <p>
          Devcomms is 100% free and open source, forever. Have an issue? Want to
          contribute? Find our GitHub here:{' '}
          <a
            href="https://github.com/codeconvoy/devcomms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Devcomms GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
