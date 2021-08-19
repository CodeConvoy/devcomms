import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/components/Channel.module.css';

export default function Channel(props) {
  const { group, channel } = props;

  // retrieve channel messages
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);
  const messagesRef = channelRef.collection('messages');
  const [messages] = useCollectionData(messagesRef, { idField: 'id' });

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
    </div>
  );
}
