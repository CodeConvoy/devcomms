import Loading from '../Loading.js';
import Chat from './Chat.js';
import Channel from './Channel.js';
import Widget from '../widgets/Widget.js';
import Modal from '../Modal';
import WidgetsIcon from '@material-ui/icons/Widgets';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Tooltip from '@material-ui/core/Tooltip';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import firebase from 'firebase/app';
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
  const [channels] = useCollectionData(
    channelsRef.orderBy('order'), { idField: 'id' }
  );
  const [widgets] = useCollectionData(
    widgetsRef.orderBy('order'), { idField: 'id' }
  );

  // creates new channel doc in firebase
  async function createChannel() {
    const channel = { name };
    setChannelModalOpen(false);
    const docRef = await channelsRef.add({ order: channels.length, ...channel });
    setCurrChannel({ id: docRef.id, ...channel });
  }

  // creates new widget doc in firebase
  async function createWidget() {
    const widget = { name, type };
    setWidgetModalOpen(false);
    const docRef = await widgetsRef.add({ order: widgets.length, ...widget });
    setCurrWidget({ id: docRef.id, ...widget });
  }

  // returns messages ref for current channel
  function getMessagesRef() {
    return channelsRef.doc(currChannel.id).collection('messages');
  }

  // resets modals
  function resetModals() {
    setName('');
    setType('sketch');
  }

  // updates channel orders in firebase
  async function updateChannelOrder() {
    const batch = firebase.firestore().batch(); // create batch
    // for each channel
    await channels.forEach((channel, i) => {
      // update channel doc at id with order
      const channelDoc = channelsRef.doc(channel.id);
      batch.update(channelDoc, { order: i });
    });
    batch.commit(); // commit batch
  }

  // updates widget orders in firebase
  async function updateWidgetOrder() {
    const batch = firebase.firestore().batch(); // create batch
    // for each widget
    await widgets.forEach((widget, i) => {
      // update widget doc at id with order
      const widgetDoc = widgetsRef.doc(widget.id);
      batch.update(widgetDoc, { order: i });
    });
    batch.commit(); // commit batch
  }

  // called after channel drag ends
  function onChannelDragEnd(result) {
    if (!result.destination) return; // out of bounds
    if (result.source.index === result.destination.index) return; // same spot
    const [removed] = channels.splice(result.source.index, 1);
    channels.splice(result.destination.index, 0, removed);
    updateChannelOrder();
  }

  // called after widget drag ends
  function onWidgetDragEnd(result) {
    if (!result.destination) return; // out of bounds
    if (result.source.index === result.destination.index) return; // same spot
    const [removed] = widgets.splice(result.source.index, 1);
    widgets.splice(result.destination.index, 0, removed);
    updateWidgetOrder();
  }

  // clear current channel and widget when group changes
  useEffect(() => {
    setCurrChannel(undefined);
    setCurrWidget(undefined);
  }, [group]);

  // select default channel on start
  useEffect(() => {
    if (channels?.length && currChannel === undefined) {
      setCurrChannel(channels[0]);
    }
  }, [channels])

  // return if loading
  if (!channels || !widgets) return <Loading />;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.selectors}>
          <DragDropContext onDragEnd={onChannelDragEnd}>
            <Droppable droppableId="droppable-channels">
              {
                (provided, snapshot) =>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {
                    channels.map((channel, i) =>
                      <Draggable
                        draggableId={channel.id}
                        index={i}
                        key={channel.id}
                      >
                        {
                          (provided, snapshot) =>
                          <div
                            className={styles.selectcontainer}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Channel
                              className={
                                currChannel?.id === channel.id ?
                                `${styles.selectbtn} ${styles.selected}` :
                                styles.selectbtn
                              }
                              onClick={() => setCurrChannel(channel)}
                              channel={channel}
                              setCurrChannel={setCurrChannel}
                              type="text"
                              docRef={channelsRef.doc(channel.id)}
                              key={channel.id}
                            />
                          </div>
                        }
                      </Draggable>
                    )
                  }
                  {provided.placeholder}
                </div>
              }
            </Droppable>
          </DragDropContext>
          <Tooltip title="New Channel" arrow>
            <button
              className={styles.addbtn}
              onClick={() => {
                resetModals();
                setChannelModalOpen(true);
              }}
            >
              <ChatBubbleIcon />
              <AddIcon />
            </button>
          </Tooltip>
        </div>
        <span className={styles.divider} />
        <div className={styles.selectors}>
          <DragDropContext onDragEnd={onWidgetDragEnd}>
            <Droppable droppableId="droppable-widgets">
              {
                (provided, snapshot) =>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {
                    widgets.map((widget, i) =>
                      <Draggable
                        draggableId={widget.id}
                        index={i}
                        key={widget.id}
                      >
                        {
                          (provided, snapshot) =>
                          <div
                            className={styles.selectcontainer}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Channel
                              className={
                                currWidget?.id === widget.id ?
                                `${styles.selectbtn} ${styles.selected}` :
                                styles.selectbtn
                              }
                              onClick={() => setCurrWidget(
                                currWidget?.id === widget.id ? undefined : widget
                              )}
                              channel={widget}
                              setCurrChannel={setCurrChannel}
                              type={widget.type}
                              docRef={widgetsRef.doc(widget.id)}
                              key={widget.id}
                            />
                          </div>
                        }
                      </Draggable>
                    )
                  }
                  {provided.placeholder}
                </div>
              }
            </Droppable>
          </DragDropContext>
          <Tooltip title="New Widget" arrow>
            <button
              className={styles.addbtn}
              onClick={() => {
                resetModals();
                setWidgetModalOpen(true);
              }}
            >
              <BuildIcon />
              <AddIcon />
            </button>
          </Tooltip>
        </div>
      </div>
      {
        currChannel ?
        <Chat messagesRef={getMessagesRef()} currentUser={currentUser} /> :
        <div className={styles.filler}>
          <ChatBubbleOutlineIcon fontSize="large" />
          <h1>No channels yet</h1>
        </div>
      }
      {
        currWidget &&
        <Widget group={group} widget={currWidget} />
      }
      <Modal open={channelModalOpen} onClose={() => setChannelModalOpen(false)}>
        <h1>New Channel</h1>
        <form onSubmit={e => {
          e.preventDefault();
          createChannel();
        }}>
          <div className="input-button">
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
          </div>
        </form>
      </Modal>
      <Modal open={widgetModalOpen} onClose={() => setWidgetModalOpen(false)}>
        <h1>New Widget</h1>
        <form onSubmit={e => {
          e.preventDefault();
          createWidget();
        }}>
          <select
            className={styles.typeinput}
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="sketch">Sketch</option>
            <option value="notes">Notes</option>
            <option value="todos">Todos</option>
          </select>
          <div className="input-button">
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
          </div>
        </form>
      </Modal>
    </>
  );
}
