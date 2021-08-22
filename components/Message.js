import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import getUsername from '../util/getUsername.js';

import styles from '../styles/components/Message.module.css';

const now = new Date();
const nowDay = now.getDate();
const nowMonth = now.getMonth();
const nowYear = now.getFullYear();
const today = new Date(nowYear, nowMonth, nowDay).setHours(0, 0, 0, 0);
const yesterday = new Date(nowYear, nowMonth, nowDay - 1).setHours(0, 0, 0, 0);

export default function Message(props) {
  const { showHeader, channelRef } = props;
  const { text, sender, sent, id } = props.message;

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');

  const uid = firebase.auth().currentUser.uid;

  // retrieve message ref
  const messagesRef = channelRef.collection('messages');
  const messageRef = messagesRef.doc(id);

  // deletes message
  async function deleteMessage() {
    if (window.confirm('Really delete message?')) await messageRef.delete();
  }

  // returns a datetime string for given datetime
  function getDateTimeString(dateTime) {
    // separate time and date
    const time = dateTime.toLocaleTimeString([], { timeStyle: 'short' });
    const date = dateTime.setHours(0, 0, 0, 0);
    if (date === today) return `${time} today`; // today
    else if (date === yesterday) return `${time} yesterday`; // yesterday
    else return dateTime.toLocaleDateString(); // past
  }

  // get sender username
  useEffect(async () => {
    if (!showHeader) return;
    const name = await getUsername(sender);
    setUsername(name);
  }, [sender])

  return (
    <div className={styles.container}>
      {
        showHeader &&
        <>
          <span>
            {username && <span>@{username} </span>}
            {getDateTimeString(sent.toDate())}
          </span>
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
