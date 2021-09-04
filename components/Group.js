import Modal from '@material-ui/core/Modal';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';

import { useState } from 'react';

import styles from '../styles/Group.module.css';

import firebase from 'firebase/app';

export default function Group(props) {
  const { group, currGroup, setCurrGroup, selectStyle } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(group.name);
  const [username, setUsername] = useState('');

  const uid = firebase.auth().currentUser.uid;

  // get group ref
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group.id);

  // resets modal
  function resetModal() {
    setName(group.name);
  }

  // deletes group
  async function deleteGroup() {
    if (window.confirm('Really delete group?')) {
      setCurrGroup('home');
      await groupRef.delete();
    }
  }

  // updates group
  async function updateGroup() {
    resetModal();
    setModalOpen(false);
    await groupRef.update({ name });
  }

  // adds user to group
  async function addUser() {
    // get user doc
    setUsername('');
    const usernamesRef = firebase.firestore().collection('usernames');
    const usernameRef = usernamesRef.doc(username);
    const usernameDoc = await usernameRef.get();
    // if user exists
    if (usernameDoc.exists) {
      const userId = usernameDoc.data().uid;
      await groupRef.update({
        members: firebase.firestore.FieldValue.arrayUnion(userId),
        usernames: firebase.firestore.FieldValue.arrayUnion(username)
      });
      // if user does not exist
    }
  }

  return (
    <>
      <div
        className={
          currGroup === group.id ?
          `${styles.container} ${selectStyle}` : styles.container
        }
        onClick={() => setCurrGroup(group.id)}
        key={group.id}
      >
        <div>{group.name}</div>
        {
          uid === group.creator &&
          <button onClick={e => {
            resetModal();
            e.stopPropagation();
            setModalOpen(true);
          }}>
            <SettingsIcon fontSize="small" />
          </button>
        }
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal">
          <h1>Editing {group.name}</h1>
          <form onSubmit={e => {
            e.preventDefault();
            updateGroup();
          }}>
            <input
              value={name}
              className={`${styles.nameinput} darkinput`}
              onChange={e => setName(e.target.value)}
              placeholder="name"
              required
            />
            <button className="iconbutton2">
              <CheckIcon />
            </button>
          </form>
          {
            group.usernames.map((username, i) =>
              <div key={i}>{username}</div>
            )
          }
          <form onSubmit={e => {
            e.preventDefault();
            addUser();
          }}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="darkinput"
              required
            />
            <button className="iconbutton2">
              <AddIcon />
            </button>
          </form>
          <button
            className={`${styles.delbutton} iconbutton2`}
            onClick={deleteGroup}
          >
            <DeleteIcon />
          </button>
        </div>
      </Modal>
    </>
  );
}
