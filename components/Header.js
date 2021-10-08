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
  const [success, setSuccess] = useState(false);

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
    const filePath = `avatars/${uid}`;
    const fileRef = firebase.storage().ref(filePath);
    await fileRef.put(file);
    const base = 'https://firebasestorage.googleapis.com';
    const url = `${base}/v0/b/dev-comms.appspot.com/o/avatars%2F${uid}?alt=media`;
    // update user docs
    userRef.update({ photo: url });
    usernameRef.update({ photo: url });
    setSuccess(true);
  }

  // resets modal
  function resetModal() {
    setUsername(currentUser.username);
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
      <div className={styles.username}>
        @{currentUser.username}
      </div>
      <Tooltip title="Sign Out" arrow>
        <button
          onClick={() => firebase.auth().signOut()}
          className="iconbutton"
        >
          <ExitToAppIcon />
        </button>
      </Tooltip>
      <Snackbar
        type="success"
        message="Photo updated. Refresh to view."
        open={success}
        setOpen={setSuccess}
      />
    </div>
  );
}
