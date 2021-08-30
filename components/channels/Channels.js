import Loading from '../Loading.js';
import Text from './Text.js';
import Widget from '../widgets/Widget.js';
import Modal from '@material-ui/core/Modal';
import WidgetsIcon from '@material-ui/icons/Widgets';
import AddIcon from '@material-ui/icons/Add';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';

import styles from '../../styles/components/channels/Channels.module.css';

export default function Channels(props) {
  const { group, currentUser } = props;

  const [currChannel, setCurrChannel] = useState(undefined);
  const [currWidget, setCurrWidget] = useState(undefined);
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

  // selects given channel
  function selectChannel(channel) {
    // toggle text channel
    if (channel.type === 'text') setCurrChannel(channel);
    // toggle widget
    else setCurrWidget(currWidget?.id === channel.id ? undefined : channel);
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
              className={
                (
                  currChannel?.id === channel.id ||
                  currWidget?.id === channel.id
                )
                ? styles.selected : undefined
              }
              onClick={() => selectChannel(channel)}
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
        <Text group={group} channel={currChannel.id} currentUser={currentUser} /> :
        <span className={styles.filler} />
      }
      {
        currWidget &&
        <Widget group={group} widget={currWidget} />
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
            <button>
              <AddIcon />
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
