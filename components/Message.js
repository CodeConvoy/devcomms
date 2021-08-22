import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useState } from 'react';
import firebase from 'firebase/app';

import styles from '../styles/components/Message.module.css';

export default function Message(props) {
  const { showHeader, channelRef } = props;
  const { text, sender, sent, id } = props.message;

  const [open, setOpen] = useState(false);

  const uid = firebase.auth().currentUser.uid;

  // retrieve message ref
  const messagesRef = channelRef.collection('messages');
  const messageRef = messagesRef.doc(id);

  // deletes message
  async function deleteMessage() {
    if (window.confirm('Really delete message?')) await messageRef.delete();
  }

  return (
    <div className={styles.container}>
      {
        showHeader &&
        <>
          <span><b>@{sender}</b></span>
          <br />
        </>
      }
      <span>{text}</span>
      {
        uid === sender &&
        <button onClick={() => setOpen(true)}>
          <EditIcon fontSize="small" />
        </button>
      }
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="modal">
          <h1>Editing Message</h1>
          <button onClick={deleteMessage}>
            <DeleteIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
}
