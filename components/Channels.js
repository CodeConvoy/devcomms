import Channel from './Channel.js';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

import styles from '../styles/components/Channels.module.css';

export default function Channels(props) {
  const { group } = props;

  const [currChannel, setCurrChannel] = useState(undefined);

  // retrieve group channels
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels');
  const [channels] = useCollectionData(channelsRef, { idField: 'id' });

  // return if loading
  if (!channels) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.channels}>
      {
        channels.map(channel =>
          <button onClick={setCurrChannel(channel.id)} key={channel.id}>
            {channel.name}
          </button>
        )
      }
      </div>
      {
        currChannel &&
        <Channel group={props.group} channel={currChannel} />
      }
    </div>
  );
}
