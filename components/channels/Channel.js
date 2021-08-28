import Modal from '@material-ui/core/Modal';
import Message from './Message.js';
import Loading from './Loading.js';
import PublishIcon from '@material-ui/icons/Publish';
import SendIcon from '@material-ui/icons/Send';

import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

import styles from '../styles/components/channels/Channel.module.css';

// delay in seconds before a new header
const headerOffset = 60 * 5;

export default function Channel(props) {
  const { group, channel, currentUser } = props;

  const [text, setText] = useState('');
  const [file, setFile] = useState(undefined);

  const uid = firebase.auth().currentUser.uid;

  // retrieve channel messages
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);
  const messagesRef = channelRef.collection('messages');
  const messagesQuery = messagesRef.orderBy('sent');
  const [messages] = useCollectionData(messagesQuery, { idField: 'id' });

  // creates new message doc in firebase
  async function sendMessage() {
    // return if empty or whitespace
    if (!text.trim()) return;
    setText('');
    await messagesRef.add({
      text: text,
      type: 'text',
      sender: uid,
      username: currentUser.username,
      sent: new Date()
    });
  }

  // sends file as message
  async function sendFile() {
    // if no file, return
    if (!file) return;
    // put file in storage and get url
    const filePath = `groups/${group}/${channel}/${file.name}`;
    const fileRef = firebase.storage().ref(filePath);
    const snapshot = await fileRef.put(file);
    const url = await snapshot.ref.getDownloadURL();
    // add file message
    await messagesRef.add({
      url: url,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      filename: file.name,
      sender: uid,
      username: currentUser.username,
      sent: new Date()
    });
    // clear file
    setFile(undefined);
  }

  // return if loading
  if (!messages) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {
          messages.map((message, i) =>
            <Message
              showHeader={
                i === 0 ||
                message.sender !== messages[i - 1].sender ||
                message.sent - messages[i - 1].sent > headerOffset
              }
              message={message}
              channelRef={channelRef}
              key={message.id}
            />
          )
        }
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage();
      }}>
        <label htmlFor="fileinput" className={styles.filebutton}>
          <PublishIcon />
        </label>
        <input
          type="file"
          id="fileinput"
          onChange={e => setFile(e.target.files[0])}
          className={styles.fileinput}
        />
        <input
          className={styles.textinput}
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <button className={styles.sendbutton}>
          <SendIcon />
        </button>
      </form>
      <Modal
        open={!!file}
        onClose={() => setFile(undefined)}
      >
        <div className="modal">
          <p>{file?.name}</p>
          <button onClick={sendFile}>
            <SendIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
}
