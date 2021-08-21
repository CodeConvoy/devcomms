import Loading from './Loading.js';
import Channel from './Channel.js';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

import styles from '../styles/components/Channels.module.css';

export default function Channels(props) {
  const { group } = props;

  const [currChannel, setCurrChannel] = useState(undefined);
  const [name, setName] = useState('');

  // retrieve group channels
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels');
  const [channels] = useCollectionData(channelsRef, { idField: 'id' });

  // creates new channel doc in firebase
  async function createChannel() {
    setName('');
    await channelsRef.add({ name: name });
  }

  // return if loading
  if (!channels) return <Loading />;

  return (
    <div>
      <div className={styles.channels}>
        {
          channels.map(channel =>
            <button onClick={() => setCurrChannel(channel.id)} key={channel.id}>
              {channel.name}
            </button>
          )
        }
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        createChannel();
      }}>
        <input
          placeholder="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button>New Channel</button>
      </form>
      {
        currChannel &&
        <Channel group={props.group} channel={currChannel} />
      }
    </div>
  );
}
