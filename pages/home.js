import Router from 'next/router';
import Loading from '../components/Loading.js';
import Header from '../components/Header.js';
import Channels from '../components/channels/Channels.js';
import Modal from '@material-ui/core/Modal';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/pages/Home.module.css';

export default function Home(props) {
  const { currentUser } = props;

  const [name, setName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [currGroup, setCurrGroup] = useState(undefined);

  // retrieve user groups
  const uid = firebase.auth().currentUser?.uid;
  const groupsRef = firebase.firestore().collection('groups');
  const groupsQuery = groupsRef
  .where('members', 'array-contains', uid ?? 'null')
  .orderBy('name');
  const [groups] = useCollectionData(groupsQuery, { idField: 'id' });

  // creates new group doc in firebase
  async function createGroup() {
    setName('');
    await groupsRef.add({
      name: name,
      creator: uid,
      members: [uid],
      created: new Date()
    });
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
          {
            groups.map(group =>
              <button
                className={currGroup === group.id ? styles.selected : undefined}
                onClick={() => setCurrGroup(group.id)}
                key={group.id}
              >
                <div>{group.name}</div>
              </button>
            )
          }
          <button onClick={() => setModalOpen(true)}>+</button>
        </div>
        {
          currGroup ?
          <Channels group={currGroup} currentUser={currentUser} /> :
          <span className={styles.filler} />
        }
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <div className="modal">
            <h1>New Group</h1>
            <form onSubmit={e => {
              e.preventDefault();
              createGroup();
            }}>
              <input
                placeholder="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <button>Create</button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
