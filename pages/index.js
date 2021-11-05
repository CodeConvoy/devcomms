import GitHubIcon from '@material-ui/icons/GitHub';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';
import SyncIcon from '@material-ui/icons/Sync';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Background from '../components/Background.js';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';

import getIcon from '../util/getIcon.js';
import firebase from 'firebase/app';
import signInWithGitHub from '../util/signInWithGitHub.js';

import styles from '../styles/pages/Index.module.css';

export default function Index(props) {
  const { authed, currentUser } = props;

  return (
    <div className={styles.container}>
      <Background />
      <p className={styles.copyright}>
        &copy;{' '}
        <a href="https://codeconvoy.org">CodeConvoy</a>
        {' '}{new Date().getFullYear()}
      </p>
      <div className={styles.links}>
        <a
          href="https://github.com/codeconvoy/devcomms"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon fontSize="large" />
        </a>
        <a
          href="https://codeconvoy.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LocalShippingIcon fontSize="large" />
        </a>
        <a
          href="https://csaye.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PersonIcon fontSize="large" />
        </a>
      </div>
      <div className={styles.center}>
        <div className={styles.carousel}>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/img/screen1.png"
                alt="screen1.png"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/img/screen2.png"
                alt="screen2.png"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/img/screen3.png"
                alt="screen3.png"
              />
            </Carousel.Item>
          </Carousel>
          <div className={styles.bottom}>
            <span>Devcomms is built by developers, for developers.</span>
            <span>Have an issue? Want to contribute? Find our GitHub here:</span>
            <a
              href="https://github.com/codeconvoy/devcomms"
              className={`blueurl ${styles.githublink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
              Devcomms GitHub
            </a>
          </div>
        </div>
        <div className={styles.overview}>
          <h1 className={styles.title}>
            <Image src="/img/logo.png" width="48" height="48" alt="logo" />
            Devcomms
          </h1>
          <p><ChatIcon />Communicate and coordinate with your team.</p>
          <p><FileCopyIcon />Manage notes, todos, and sketches all in one place.</p>
          <p><SyncIcon />Keep everyone in sync with real-time widgets.</p>
          <p><LockOpenIcon />100% open source and developer-focused, forever.</p>
          <div className={styles.link}>
            {
              authed ?
              <Link href="/home">
                <a className={styles.biglink}>Home</a>
              </Link> :
              <button className="bluebutton" onClick={signInWithGitHub}>
                Sign in with GitHub
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
