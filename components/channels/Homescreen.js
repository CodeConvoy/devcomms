import Loading from '../Loading.js';
import Chat from './Chat.js';
import Modal from '@material-ui/core/Modal';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

import styles from '../../styles/components/channels/Homescreen.module.css';

export default function Homescreen(props) {
  const { currentUser } = props;

  const [currUser, setCurrUser] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  // get user data
  const uid = firebase.auth().currentUser.uid;
  const usersRef = firebase.firestore().collection('usernames');
  const chatsRef = firebase.firestore().collection('chats');
  const [users] = useCollectionData(usersRef);

  // returns message ref based on current user
  function getMessagesRef() {
    // get chat id
    const chatId = uid < currUser.uid ?
    `${uid}-${currUser.uid}` : `${currUser.uid}-${uid}`;
    return chatsRef.doc(chatId).collection('messages');
  }

  // return if loading
  if (!users) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.users}>
        {
          users.map(user =>
            <button
              className={currUser?.uid === user.uid ? styles.selected : undefined}
              onClick={() => setCurrUser(user)}
              key={user.uid}
            >
              <div>{user.username}</div>
            </button>
          )
        }
      </div>
      {
        currUser &&
        <Chat messagesRef={getMessagesRef()} currentUser={currentUser} />
      }
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal">
          <h1>Add Friend</h1>
          <form onSubmit={e => {
            e.preventDefault();
            addFriend();
          }}>
            <input
              placeholder="username"
              className="darkinput"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <button className="iconbutton2">
              <AddIcon />
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
