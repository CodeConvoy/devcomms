import Header from '../components/Header.js';
import Channels from '../components/Channels.js';

import firebase from 'firebase/app';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/pages/Home.module.css';

export default function Home() {
  const [currGroup, setCurrGroup] = useState(undefined);

  // retrieve user groups
  const uid = firebase.auth().currentUser.uid;
  const groupsRef = firebase.firestore().collection('groups');
  const groupsQuery = groupsRef.where('members', 'array-contains', uid);
  const [groups] = useCollectionData(groupsQuery, { idField: 'id' });

  // return if loading
  if (!groups) return <div>Loading...</div>;

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
        {
          currGroup &&
          <Channels group={currGroup} />
        }
      </div>
    </div>
  );
}
