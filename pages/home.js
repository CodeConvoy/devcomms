import Header from '../components/Header.js';
import Channels from '../components/Channels.js';

import firebase from 'firebase/app';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/pages/Home.module.css';

export default function Home() {
  const [currGroup, setCurrGroup] = useState(undefined);
  const [name, setName] = useState('');

  // retrieve user groups
  const uid = firebase.auth().currentUser?.uid;
  const groupsRef = firebase.firestore().collection('groups');
  const groupsQuery = groupsRef.where('members', 'array-contains', uid ?? 'null');
  const [groups] = useCollectionData(groupsQuery, { idField: 'id' });

  // return if loading
  if (!groups) return <div>Loading...</div>;

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
      <div>
        <div className={styles.groups}>
          {
            groups.map(group =>
              <button onClick={() => setCurrGroup(group.id)} key={group.id}>
                {group.name}
              </button>
            )
          }
        </div>
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
          <button>New Group</button>
        </form>
        {
          currGroup &&
          <Channels group={currGroup} />
        }
      </div>
    </div>
  );
}
