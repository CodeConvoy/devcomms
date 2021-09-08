import Loading from '../Loading.js';
import Chat from './Chat.js';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import SearchIcon from '@material-ui/icons/Search';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

import styles from '../../styles/components/channels/Homescreen.module.css';

export default function Homescreen(props) {
  const { currentUser } = props;

  const [currUser, setCurrUser] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [foundUsers, setFoundUsers] = useState(undefined);

  // get user data
  const uid = firebase.auth().currentUser.uid;
  const usersRef = firebase.firestore().collection('users');
  const userRef = usersRef.doc(uid);

  // get users data
  const usernamesRef = firebase.firestore().collection('usernames');
  const chatsRef = firebase.firestore().collection('chats');

  // returns message ref based on current user
  function getMessagesRef() {
    // get chat id
    const chatId = uid < currUser.uid ?
    `${uid}-${currUser.uid}` : `${currUser.uid}-${uid}`;
    return chatsRef.doc(chatId).collection('messages');
  }

  // adds user as friend
  async function addFriend(user) {
    await userRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion({
        username: user.username, uid: user.uid
      })
    });
  }

  // resets modal
  function resetModal() {
    setUsername('');
    setFoundUsers(undefined);
  }

  // searches users with given username
  async function searchUsers() {
    // clear found users
    setFoundUsers(undefined);
    // query users
    const usersQuery = usernamesRef
    .where('username', '>=', username)
    .where('username', '<', `${username}~`)
    .limit(10);
    const users = await usersQuery.get();
    // set found users
    setFoundUsers(users.docs.map(doc => doc.data()));
  }

  // return if loading
  if (!currentUser.friends) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.users}>
        {
          currentUser.friends.map(user =>
            <button
              className={currUser?.uid === user.uid ? styles.selected : undefined}
              onClick={() => setCurrUser(user)}
              key={user.uid}
            >
              <div>{user.username}</div>
            </button>
          )
        }
        <Tooltip title="Add Friend" arrow>
          <button onClick={() => {
            resetModal();
            setModalOpen(true);
          }}>
            <AddIcon />
          </button>
        </Tooltip>
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
            searchUsers();
          }}>
            <div className="input-button">
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={`${styles.usernameinput} darkinput`}
                placeholder="username"
                required
              />
              <button className="iconbutton2">
                <SearchIcon />
              </button>
            </div>
          </form>
          {
            foundUsers &&
            (
              !foundUsers.length ?
              <div>No users found</div> :
              foundUsers.map(user =>
                <div className={styles.member} key={user.uid}>
                  {user.username}
                  {
                    !currentUser.friends.some(f => f.uid === user.uid) &&
                    <button onClick={() => addFriend(user)}>
                      <AddIcon />
                    </button>
                  }
                </div>
              )
            )
          }
        </div>
      </Modal>
    </div>
  );
}
