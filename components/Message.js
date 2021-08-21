import firebase from 'firebase/app';

import styles from '../styles/Message.module.css';

export default function Message(props) {
  const { channelRef } = props;
  const { text, sender, id } = props.message;

  const uid = firebase.auth().currentUser.uid;

  // retrieve message ref
  const messagesRef = channelRef.collection('messages');
  const messageRef = messagesRef.doc(id);

  // deletes message
  async function deleteMessage() {
    await messageRef.delete();
  }

  return (
    <div>
      <span>{text}</span>
      {
        uid === sender &&
        <button onClick={deleteMessage}>Delete</button>
      }
    </div>
  );
}
