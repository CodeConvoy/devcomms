import Image from 'next/image';
import Link from 'next/link';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from './Modal';

import firebase from 'firebase/app';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';

import styles from '../styles/components/Header.module.css';

export default function Header(props) {
  const { currentUser } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState(currentUser.username);

  const uid = firebase.auth().currentUser.uid;

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
    const userRef = firebase.firestore().collection('users').doc(uid);
    const usernameRef = firebase.firestore().collection('usernames')
    .doc(currentUser.username.toLowerCase());
    userRef.update({ photo: url });
    usernameRef.update({ photo: url });
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
      <div className={styles.username}>@{currentUser.username}</div>
      <Tooltip title="Sign Out" arrow>
        <button
          onClick={() => firebase.auth().signOut()}
          className="iconbutton"
        >
          <ExitToAppIcon />
        </button>
      </Tooltip>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h1>Change Username</h1>
        <form onSubmit={e => {
          e.preventDefault();
          updateUsername();
        }}>
          <div className="input-button">
            <input
              placeholder="username"
              className="darkinput"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <button className="iconbutton2">
              <CheckIcon />
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
