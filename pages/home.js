import Router from 'next/router';
import Loading from '../components/Loading.js';
import Header from '../components/Header.js';
import Channels from '../components/Channels.js';
import Widgets from '../components/Widgets.js';
import Modal from '@material-ui/core/Modal';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/pages/Home.module.css';

export default function Home(props) {
  const [currGroup, setCurrGroup] = useState(undefined);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  // retrieve user groups
  const uid = firebase.auth().currentUser?.uid;
  const groupsRef = firebase.firestore().collection('groups');
  const groupsQuery = groupsRef
  .where('members', 'array-contains', uid ?? 'null')
  .orderBy('name');
  const [groups] = useCollectionData(groupsQuery, { idField: 'id' });

  // listen for user auth
  useEffect(() => {
    if (props.authed === false) Router.push('/signin');
  }, [props.authed]);

  // return if loading
  if (props.authed !== true || !groups) return <Loading />;

  // creates new group doc in firebase
  async function createGroup() {
    setName('');
    const uid = firebase.auth().currentUser.uid;
    await groupsRef.add({
      name: name,
      creator: uid,
      members: [uid],
      created: new Date()
    });
  }

  return (
    <div className={styles.container}>
      <Header />
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
          <button onClick={() => setOpen(true)}>+</button>
        </div>
        {
          currGroup &&
          <Channels group={currGroup} />
        }
        <Widgets />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
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
