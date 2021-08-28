import Link from 'next/link';
import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';

import styles from '../styles/components/Message.module.css';

const now = new Date();
const nowDay = now.getDate();
const nowMonth = now.getMonth();
const nowYear = now.getFullYear();
const today = new Date(nowYear, nowMonth, nowDay).setHours(0, 0, 0, 0);
const yesterday = new Date(nowYear, nowMonth, nowDay - 1).setHours(0, 0, 0, 0);

export default function Message(props) {
  const { showHeader, channelRef } = props;
  const { text, sender, username, sent, id } = props.message;

  const [open, setOpen] = useState(false);

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

  return (
    <div className={styles.container}>
      {
        showHeader &&
        <>
          <span>
            <Link href={`/users/${username}`}>
              <a>@{username}</a>
            </Link>
            {' '}<b>{getDateTimeString(sent.toDate())}</b>
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
