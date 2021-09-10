import GitHubIcon from '@material-ui/icons/GitHub';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AddIcon from '@material-ui/icons/Add';
import PersonIcon from '@material-ui/icons/Person';
import Background from '../components/Background.js';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';

import getIcon from '../util/getIcon.js';
import firebase from 'firebase/app';
import signInWithGitHub from '../util/signInWithGitHub.js';

import styles from '../styles/pages/Index.module.css';

export default function Index() {
  return (
    <div className={styles.container}>
      <Background />
      <p className={styles.copyright}>
        &copy; Devcomms {new Date().getFullYear()}
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
        <div className={styles.top}>
          <div className={styles.carousel}>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://via.placeholder.com/600x350"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://via.placeholder.com/600x350"
                  alt="Second slide"
                />
                <Carousel.Caption>
                  <h3>Second slide label</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://via.placeholder.com/600x350"
                  alt="Third slide"
                />
                <Carousel.Caption>
                  <h3>Third slide label</h3>
                  <p>Praesent commodo cursus magna, vel scelerisque nisl.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
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
                firebase.auth().currentUser ?
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
          <button className="bluebutton" onClick={signInWithGitHub}>
            Sign in with GitHub
          </button>
        }
      </div>
    </div>
  );
}
