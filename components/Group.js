import Modal from './Modal';
import Loading from './Loading';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import Tooltip from '@material-ui/core/Tooltip';

import { useState } from 'react';

import styles from '../styles/Group.module.css';

import firebase from 'firebase/app';

export default function Group(props) {
  const { group, currGroup, setCurrGroup, selectStyle } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [name, setName] = useState(group.name);
  const [username, setUsername] = useState('');
  const [foundUsers, setFoundUsers] = useState(null);

  const uid = firebase.auth().currentUser.uid;
  const usernamesRef = firebase.firestore().collection('usernames');

  // get group ref
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group.id);

  // resets modal
  function resetModal() {
    setName(group.name);
    setUsername('');
    setFoundUsers(null);
    setTab(0);
  }

  // deletes group
  async function deleteGroup() {
    // confirm delete
    if (!window.confirm(`Delete ${group.name}?`)) return;
    // delete group
    setCurrGroup('home');
    await groupRef.delete();
  }

  // updates group
  async function updateGroup() {
    setModalOpen(false);
    await groupRef.update({ name });
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

  // adds user to group
  async function addUser(user) {
    await groupRef.update({
      members: firebase.firestore.FieldValue.arrayUnion(user.uid),
      users: firebase.firestore.FieldValue.arrayUnion({
        username: user.username, uid: user.uid
      })
    });
  }

  // removes user from group
  async function removeUser(user) {
    const index = group.users.indexOf(user);
    if (index === -1) return;
    if (!window.confirm(`Remove @${user.username} from ${group.name}?`)) return;
    await groupRef.update({
      members: firebase.firestore.FieldValue.arrayRemove(user.uid),
      users: firebase.firestore.FieldValue.arrayRemove(user)
    });
  }

  // returns abbreviated version of given name
  function abbreviateName(name) {
    const words = name.split(' ').filter(w => w); // split name by spaces
    const letters = words.map(word => word[0]); // get word letters
    return letters.join('').toUpperCase(); // return letters to uppercase
  }

  return (
    <>
      <Tooltip title={group.name} arrow>
        <div
          className={
            currGroup === group.id ?
            `${styles.container} ${selectStyle}` : styles.container
          }
          onClick={() => setCurrGroup(group.id)}
          key={group.id}
        >
          <div>{abbreviateName(group.name)}</div>
          {
            uid === group.creator &&
            <Tooltip title="Edit Group" arrow>
              <button onClick={e => {
                resetModal();
                e.stopPropagation();
                setModalOpen(true);
              }}>
                <SettingsIcon fontSize="small" />
              </button>
            </Tooltip>
          }
        </div>
      </Tooltip>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h1>Editing<GroupIcon /><span>{group.name}</span></h1>
        <div className={styles.select}>
          <Tooltip title="Edit" arrow>
            <button
              className={`${tab === 0 && styles.selected} iconbutton2`}
              onClick={() => setTab(0)}
            >
              <EditIcon />
            </button>
          </Tooltip>
          <Tooltip title="Members" arrow>
            <button
              className={`${tab === 1 && styles.selected} iconbutton2`}
              onClick={() => setTab(1)}
            >
              <GroupIcon />
            </button>
          </Tooltip>
          <Tooltip title="Delete Group" arrow>
            <button
              className="iconbutton2"
              onClick={deleteGroup}
            >
              <DeleteIcon />
            </button>
          </Tooltip>
        </div>
        {
          tab === 0 &&
          <form onSubmit={e => {
            e.preventDefault();
            updateGroup();
          }}>
            <div className="input-button">
            <input
              value={name}
              className="darkinput"
              onChange={e => setName(e.target.value)}
              placeholder="name"
              required
            />
            <Tooltip title="Save Changes" arrow>
              <button className="iconbutton2">
                <CheckIcon />
              </button>
            </Tooltip>
            </div>
          </form>
        }
        {
          tab === 1 &&
          <div>
            {
              group.users.map((user, i) =>
                <div className={styles.member} key={i}>
                  {user.username}
                  {
                    user.uid !== group.creator &&
                    <Tooltip title="Remove" arrow>
                      <button onClick={() => removeUser(user)}>
                        <ClearIcon fontSize="small" />
                      </button>
                    </Tooltip>
                  }
                </div>
              )
            }
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
                      !group.members.includes(user.uid) &&
                      <Tooltip title="Add" arrow>
                        <button onClick={() => addUser(user)}>
                          <AddIcon />
                        </button>
                      </Tooltip>
                    }
                  </div>
                )
              )
            }
          </div>
        }
      </Modal>
    </>
  );
}
