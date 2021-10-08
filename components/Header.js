import Image from 'next/image';
import Link from 'next/link';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from './Modal';
import Snackbar from './Snackbar';

import firebase from 'firebase/app';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';

import styles from '../styles/components/Header.module.css';

export default function Header(props) {
  const { currentUser } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState(currentUser.username);

  // get user doc references
  const uid = firebase.auth().currentUser.uid;
  const usersRef = firebase.firestore().collection('users');
  const userRef = usersRef.doc(uid);
  const usernamesRef = firebase.firestore().collection('usernames');
  const usernameRef = usernamesRef.doc(currentUser.username.toLowerCase());

  // uploads and sets avatar
  async function setAvatar(file) {
    // if no file, return
    if (!file) return;
    // put file in storage and get url
    const filePath = `avatars/${uuid()}`;
    const fileRef = firebase.storage().ref(filePath);
    const snapshot = await fileRef.put(file);
    const url = await snapshot.ref.getDownloadURL();
    // update user docs
    userRef.update({ photo: url });
    usernameRef.update({ photo: url });
  }

  // resets modal
  function resetModal() {
    setUsername(currentUser.username);
  }

  // updates username in firebase
  async function updateUsername() {
    setIsError(false);
    // verify username chars
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      setError("Username can only contain alphanumeric characters and underscore.");
      setIsError(true);
      return;
    }
    // verify username length
    if (username.length < 2 || username.length > 16) {
      setError("Username must be between 2 and 16 characters.");
      setIsError(true);
      return;
    }
    // verify username availability
    const usernameLower = username.toLowerCase();
    const newUsernameRef = usernamesRef.doc(usernameLower);
    const newUsernameDoc = await newUsernameRef.get();
    if (newUsernameDoc.exists) {
      setError("Username is taken. Please try another.");
      setIsError(true);
      return;
    }
    // update user docs
    setModalOpen(false);
    userRef.update({ username, usernameLower });
    usernameRef.delete();
    newUsernameRef.set({
      uid, photo: currentUser.photo,
      username, usernameLower
    });
  }

  // on error closed
  function onCloseError(event, reason) {
    if (reason !== 'clickaway') setIsError(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src="/img/logo.png" width="48" height="48" alt="logo" />
      </div>
      <h1>Devcomms</h1>
      <span className={styles.flexfill} />
      <Tooltip title="Change Avatar" arrow>
        <label className={styles.avatar}>
          {
            // next image component has issues with firebase storage
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUser.photo} width="40" height="40" alt="avatar" />
          }
          <input
            type="file"
            onChange={e => setAvatar(e.target.files[0])}
            className={styles.fileinput}
          />
        </label>
      </Tooltip>
      <Tooltip title="Sign Out" arrow>
        <button
          onClick={() => firebase.auth().signOut()}
          className="iconbutton"
        >
          <ExitToAppIcon />
        </button>
      </Tooltip>
    </div>
  );
}
