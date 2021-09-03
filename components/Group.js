import Modal from '@material-ui/core/Modal';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';

import { useState } from 'react';

import styles from '../styles/Group.module.css';

import firebase from 'firebase/app';

export default function Group(props) {
  const { group, currGroup, setCurrGroup, selectStyle } = props;

  const [modalOpen, setModalOpen] = useState(false);

  const uid = firebase.auth().currentUser.uid;

  // deletes group
  async function deleteGroup() {
    if (window.confirm('Really delete group?')) {
      await firebase.firestore().collection('groups').doc(group.id).delete();
    }
  }

  return (
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
        <button onClick={() => setModalOpen(true)}>
          <SettingsIcon fontSize="small" />
        </button>
      }
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal">
          <h1>Editing Group</h1>
          <button className="iconbutton2" onClick={deleteGroup}>
            <DeleteIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
}
