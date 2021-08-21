import Loading from './Loading.js';
import Channel from './Channel.js';
import Modal from '@material-ui/core/Modal';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

import styles from '../styles/components/Channels.module.css';

export default function Channels(props) {
  const { group } = props;

  const [currChannel, setCurrChannel] = useState(undefined);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  // retrieve group channels
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels');
  const channelsQuery = channelsRef.orderBy('name');
  const [channels] = useCollectionData(channelsQuery, { idField: 'id' });

  // creates new channel doc in firebase
  async function createChannel() {
    setName('');
    await channelsRef.add({ name: name });
  }

  // return if loading
  if (!channels) return <Loading />;

  return (
    <>
      <div className={styles.channels}>
        {
          channels.map(channel =>
            <button
              className={currChannel === channel.id ? styles.selected : undefined}
              onClick={() => setCurrChannel(channel.id)}
              key={channel.id}
            >
              <div>{channel.name}</div>
            </button>
          )
        }
        <button onClick={() => setOpen(true)}>+</button>
      </div>
      {
        currChannel &&
        <Channel group={props.group} channel={currChannel} />
      }
      <Modal
        className={styles.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
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
      </Modal>
    </>
  );
}
