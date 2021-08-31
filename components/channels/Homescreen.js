import Loading from '../Loading.js';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

import styles from '../../styles/components/channels/Homescreen.module.css';

export default function Homescreen() {
  const [currUser, setCurrUser] = useState(undefined);

  const usersRef = firebase.firestore().collection('users');
  const [users] = useCollectionData(usersRef, { idField: 'id' });

  if (!users) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.users}>
        {
          users.map(user =>
            <button
              onClick={() => setCurrUser(user)}
              key={user.id}
            >
              {user.username}
            </button>
          )
        }
      </div>
    </div>
  );
}
