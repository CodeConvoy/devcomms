import Loading from '../Loading.js';
import Channel from './Channel.js';
import Modal from '@material-ui/core/Modal';
import WidgetsIcon from '@material-ui/icons/Widgets';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';

import styles from '../../styles/components/channels/Channels.module.css';

export default function Channels(props) {
  const { group, currentUser } = props;

  const [currChannel, setCurrChannel] = useState(undefined);
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [modalOpen, setModalOpen] = useState(false);

  // retrieve group channels
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels');
  const channelsQuery = channelsRef.orderBy('name');
  const [channels] = useCollectionData(channelsQuery, { idField: 'id' });

  // creates new channel doc in firebase
  async function createChannel() {
    setName('');
    await channelsRef.add({ name, type });
  }

  // clear current channel when group changes
  useEffect(() => {
    setCurrChannel(undefined);
  }, [group]);

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
              {channel.name}
            </button>
          )
        }
        <button onClick={() => setModalOpen(true)}>+</button>
      </div>
      {
        currChannel ?
        <Channel group={group} channel={currChannel} currentUser={currentUser} /> :
        <span className={styles.filler} />
      }
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal">
          <h1>New Channel</h1>
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
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="text">Text</option>
              <option value="sketch">Sketch</option>
              <option value="notes">Notes</option>
              <option value="todos">Todos</option>
            </select>
            <button>Create</button>
          </form>
        </div>
      </Modal>
    </>
  );
}
