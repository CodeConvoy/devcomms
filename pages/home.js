import Router from 'next/router';
import Loading from '../components/Loading.js';
import Header from '../components/Header.js';
import Group from '../components/Group.js';
import Feedback from '../components/Feedback.js';
import Homescreen from '../components/channels/Homescreen.js';
import Channels from '../components/channels/Channels.js';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Tooltip from '@material-ui/core/Tooltip';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/pages/Home.module.css';

export default function Home(props) {
  const { authed, currentUser } = props;

  const [name, setName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [currGroup, setCurrGroup] = useState('home');

  // retrieve user groups
  const uid = firebase.auth().currentUser?.uid;
  const groupsRef = firebase.firestore().collection('groups');
  const groupsQuery = groupsRef
  .where('members', 'array-contains', uid ?? 'null')
  .orderBy('name');
  const [groups] = useCollectionData(groupsQuery, { idField: 'id' });

  // creates new group doc in firebase
  async function createGroup() {
    resetModal();
    const docRef = await groupsRef.add({
      name: name,
      creator: uid,
      members: [uid],
      users: [{ username: currentUser.username, uid }],
      created: new Date()
    });
    setCurrGroup(docRef.id);
  }

  // resets modal
  function resetModal() {
    setName('');
    setModalOpen(false);
  }

  // listen for user auth
  useEffect(() => {
    if (!authed) Router.push('/');
    else if (!currentUser) Router.push('/setup');
  }, [authed, currentUser]);

  // return if loading
  if (!currentUser || !groups) return <Loading />;

  return (
    <div className={styles.container}>
      <Feedback />
      <Header currentUser={currentUser} />
      <div className={styles.page}>
        <div className={styles.groups}>
          <Tooltip title="Home" arrow>
            <div
              className={currGroup === 'home' ? styles.selected : undefined}
              onClick={() => setCurrGroup('home')}
            >
              <HomeIcon />
            </div>
          </Tooltip>
          {
            groups.map(group =>
              <Group
                group={group}
                currGroup={currGroup}
                setCurrGroup={setCurrGroup}
                selectStyle={styles.selected}
                key={group.id}
              />
            )
          }
          <Tooltip title="New Group" arrow>
            <div onClick={() => setModalOpen(true)}>
              <AddIcon />
            </div>
          </Tooltip>
        </div>
        {
          currGroup === 'home' ?
          <Homescreen currentUser={currentUser} /> :
          currGroup ?
          <Channels group={currGroup} currentUser={currentUser} /> :
          <span className={styles.filler} />
        }
        <Modal
          open={modalOpen}
          onClose={resetModal}
        >
          <div className="muimodal">
            <h1>New Group</h1>
            <form onSubmit={e => {
              e.preventDefault();
              createGroup();
            }}>
              <div className="input-button">
                <input
                  placeholder="name"
                  className="darkinput"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <button className="iconbutton2">
                  <AddIcon />
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
