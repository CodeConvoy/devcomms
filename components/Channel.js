import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

import styles from '../styles/components/Channel.module.css';

export default function Channel(props) {
  const { group, channel } = props;

  const [text, setText] = useState('');

  // retrieve channel messages
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);
  const messagesRef = channelRef.collection('messages');
  const [messages] = useCollectionData(messagesRef, { idField: 'id' });

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
  if (!messages) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.messages}>
        {
          messages.map(message =>
            <p key={message.id}>{message.text}</p>
          )
        }
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage();
      }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <button>Send</button>
      </form>
    </div>
  );
}
