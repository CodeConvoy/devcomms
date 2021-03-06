import Loading from '../Loading.js';
import Chat from './Chat.js';
import Modal from '../Modal';
import User from './User.js';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

import styles from '../../styles/components/channels/Homescreen.module.css';

export default function Homescreen(props) {
  const { currentUser } = props;

  const [currUser, setCurrUser] = useState(
    currentUser?.friends?.length ? currentUser.friends[0] : undefined
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [foundUsers, setFoundUsers] = useState(null);

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
    const friend = {
      username: user.username, uid: user.uid, photo: user.photo
    };
    await userRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(friend)
    });
    setCurrUser(friend);
  }

  // removes user as friend
  async function removeFriend(user) {
    if (!window.confirm(`Remove @${user.username} as a friend?`)) return;
    if (currUser?.uid === user.uid) setCurrUser(undefined);
    await userRef.update({
      friends: firebase.firestore.FieldValue.arrayRemove(user)
    });
  }

  // resets modal
  function resetModal() {
    setUsername('');
    setFoundUsers(null);
  }

  // searches users with given username
  async function searchUsers() {
    // clear found users
    setFoundUsers(undefined);
    // query users
    const usersQuery = usernamesRef
    .where('usernameLower', '>=', username.toLowerCase())
    .where('usernameLower', '<', `${username.toLowerCase()}~`)
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
            <User
              user={user}
              currUser={currUser}
              setCurrUser={setCurrUser}
              styles={styles}
              removeFriend={removeFriend}
              key={user.uid}
            />
          )
        }
        <Tooltip title="Add Friend" arrow>
          <div onClick={() => {
            resetModal();
            setModalOpen(true);
          }}>
            <AddIcon />
          </div>
        </Tooltip>
      </div>
      {
        currUser ?
        <Chat messagesRef={getMessagesRef()} currentUser={currentUser} /> :
        <div className={styles.filler}>
          <PersonOutlineIcon fontSize="large" />
          <h1>No friends yet</h1>
        </div>
      }
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h1>Add Friend</h1>
        <form onSubmit={e => {
          e.preventDefault();
          searchUsers();
        }}>
          <div className={`${styles.usernameinput} input-button`}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="darkinput"
              placeholder="username"
              required
            />
            <Tooltip title="Search" arrow>
              <button className="iconbutton2">
                <SearchIcon />
              </button>
            </Tooltip>
          </div>
        </form>
        {
          foundUsers === undefined && <Loading />
        }
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
                  <Tooltip title="Add" arrow>
                    <button onClick={() => addFriend(user)}>
                      <AddIcon />
                    </button>
                  </Tooltip>
                }
              </div>
            )
          )
        }
      </Modal>
    </div>
  );
}
