import Router from 'next/router';
import Loading from '../components/Loading.js';
import Header from '../components/Header.js';
import Group from '../components/Group.js';
import Homescreen from '../components/channels/Homescreen.js';
import Channels from '../components/channels/Channels.js';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/pages/Home.module.css';

export default function Home(props) {
  const { currentUser } = props;

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
      usernames: [currentUser.username],
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
    if (!currentUser) Router.push('/signin');
  }, [currentUser]);

  // return if loading
  if (!currentUser || !groups) return <Loading />;

  return (
    <div className={styles.container}>
      <Header currentUser={currentUser} />
      <div className={styles.page}>
        <div className={styles.groups}>
          <div
            className={currGroup === 'home' ? styles.selected : undefined}
            onClick={() => setCurrGroup('home')}
          >
            <HomeIcon />
          </div>
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
          <div onClick={() => setModalOpen(true)}>
            <AddIcon />
          </div>
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
          <div className="modal">
            <h1>New Group</h1>
            <form onSubmit={e => {
              e.preventDefault();
              createGroup();
            }}>
              <input
                placeholder="name"
                className={`${styles.nameinput} darkinput`}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <button className="iconbutton2">
                <AddIcon />
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
