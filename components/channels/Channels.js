import Loading from '../Loading.js';
import Chat from './Chat.js';
import Channel from './Channel.js';
import Widget from '../widgets/Widget.js';
import Modal from '@material-ui/core/Modal';
import WidgetsIcon from '@material-ui/icons/Widgets';
import AddIcon from '@material-ui/icons/Add';

import firebase from 'firebase/app';
import getIcon from '../../util/getIcon.js';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';

import styles from '../../styles/components/channels/Channels.module.css';

export default function Channels(props) {
  const { group, currentUser } = props;

  const [currChannel, setCurrChannel] = useState(undefined);
  const [currWidget, setCurrWidget] = useState(undefined);
  const [name, setName] = useState('');
  const [type, setType] = useState('sketch');
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);

  // retrieve group channels and widgets
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels');
  const widgetsRef = groupRef.collection('widgets');
  const [channels] = useCollectionData(channelsRef, { idField: 'id' });
  const [widgets] = useCollectionData(widgetsRef, { idField: 'id' });

  // creates new channel doc in firebase
  async function createChannel() {
    const channelName = name;
    resetModal();
    const docRef = await channelsRef.add({ name: channelName });
    setCurrChannel({ id: docRef.id, name: channelName });
  }

  // creates new widget doc in firebase
  async function createWidget() {
    const widget = { name, type };
    resetModal();
    const docRef = await widgetsRef.add(widget);
    setCurrWidget({ id: docRef.id, ...widget });
  }

  // returns messages ref for current channel
  function getMessagesRef() {
    return channelsRef.doc(currChannel.id).collection('messages');
  }

  // resets modal
  function resetModal() {
    setName('');
    setType('sketch');
    setChannelModalOpen(false);
    setWidgetModalOpen(false);
  }

  // clear current channel and widget when group changes
  useEffect(() => {
    setCurrChannel(undefined);
    setCurrWidget(undefined);
  }, [group]);

  // return if loading
  if (!channels || !widgets) return <Loading />;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.channels}>
          {
            channels.map(channel =>
              <button
                className={
                  currChannel?.id === channel.id ? styles.selected : undefined
                }
                onClick={() => setCurrChannel(channel)}
                key={channel.id}
              >
                {getIcon('text')}
                <span>{channel.name}</span>
              </button>
            )
          }
          <button onClick={() => setChannelModalOpen(true)}>
            <AddIcon />
          </button>
        </div>
        <div className={styles.channels}>
          {
            widgets.map(widget =>
              <button
                className={
                  currWidget?.id === widget.id ? styles.selected : undefined
                }
                onClick={() => setCurrWidget(
                  currWidget?.id === widget.id ? undefined : currWidget
                )}
                key={widget.id}
              >
                {getIcon(widget.type)}
                <span>{widget.name}</span>
              </button>
            )
          }
          <button onClick={() => setWidgetModalOpen(true)}>
            <AddIcon />
          </button>
        </div>
      </div>
      {
        currChannel ?
        <Chat messagesRef={getMessagesRef()} currentUser={currentUser} /> :
        <span className={styles.filler} />
      }
      {
        currWidget &&
        <Widget group={group} widget={currWidget} />
      }
      <Modal
        open={channelModalOpen}
        onClose={resetModal}
      >
        <div className="modal">
          <h1>New Channel</h1>
          <form onSubmit={e => {
            e.preventDefault();
            createChannel();
          }}>
            <input
              placeholder="name"
              className="darkinput"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <button className="iconbutton2">
              <AddIcon />
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        open={widgetModalOpen}
        onClose={resetModal}
      >
        <div className="modal">
          <h1>New Widget</h1>
          <form onSubmit={e => {
            e.preventDefault();
            createWidget();
          }}>
            <input
              placeholder="name"
              className="darkinput"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <select
              className={styles.typeinput}
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="sketch">Sketch</option>
              <option value="notes">Notes</option>
              <option value="todos">Todos</option>
            </select>
            <button className="iconbutton2">
              <AddIcon />
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
