import GitHubIcon from '@material-ui/icons/GitHub';
import GroupIcon from '@material-ui/icons/Group';
import AddIcon from '@material-ui/icons/Add';
import Background from '../components/Background.js';
import Image from 'next/image';
import Link from 'next/link';

import getIcon from '../util/getIcon.js';
import firebase from 'firebase/app';

import styles from '../styles/pages/Index.module.css';

export default function Index() {
  return (
    <div className={styles.container}>
      <Background />
      <div className={styles.center}>
        <Image src="/img/logo.png" width="64" height="64" alt="logo" />
        <h1>Devcomms</h1>
        <p>Team communication and coordination all in one place.</p>
        <hr />
        <p>Devcomms is an open source, developer-focused team communication and
        coordination tool aiming to simplify and streamline group development.
        </p>
        <div className={styles.iconlist}>
          <GroupIcon />
          {getIcon('text')}
          {getIcon('sketch')}
          {getIcon('notes')}
          {getIcon('todos')}
          <AddIcon />
        </div>
        <p>Instead of having one tool for chatting, one tool for arranging
        notes, and one tool for setting goals, you can do all of that and more
        with Devcomms. No longer will you have to struggle to coordinate across
        several apps.</p>
        <hr />
        <p>
          Devcomms is 100% free and open source.<br />
          Have an issue? Want to contribute? Find our GitHub here:<br />
          <a
            href="https://github.com/codeconvoy/devcomms"
            className={styles.githublink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
            Devcomms GitHub
          </a>
        </p>
        <hr />
        {
          firebase.auth().currentUser ?
          <Link href="/home">
            <a className={styles.biglink}>Home</a>
          </Link> :
          <>
            <Link href="/signin">
              <a className={styles.biglink}>Sign In</a>
            </Link>
            <Link href="/signup">
              <a className={styles.biglink}>Sign Up</a>
            </Link>
          </>
        }
      </div>
    </div>
  );
}
