import Modal from '@material-ui/core/Modal';
import Message from './Message.js';
import Loading from './Loading.js';
import PublishIcon from '@material-ui/icons/Publish';
import SendIcon from '@material-ui/icons/Send';

import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

import styles from '../styles/components/Channel.module.css';

export default function Channel(props) {
  const { groupRef, channel } = props;

  const [text, setText] = useState('');
  const [file, setFile] = useState(undefined);

  const uid = firebase.auth().currentUser.uid;

  // retrieve channel messages
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);
  const messagesRef = channelRef.collection('messages');
  const messagesQuery = messagesRef.orderBy('sent');
  const [messages] = useCollectionData(messagesQuery, { idField: 'id' });

  // creates new message doc in firebase
  async function sendMessage() {
    setText('');
    const uid = firebase.auth().currentUser.uid;
    await messagesRef.add({
      text: text,
      sender: uid,
      sent: new Date()
    });
  }

  // return if loading
  if (!messages) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {
          messages.map(message =>
            <Message
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
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <button>Send</button>
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
