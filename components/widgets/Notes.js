import Loading from '../Loading.js';
import DescriptionIcon from '@material-ui/icons/Description';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';

import styles from '../../styles/components/widgets/Notes.module.css';

export default function Notes(props) {
  const { group, widget } = props;

  const [text, setText] = useState(undefined);

  // retrieve notes reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(widget.id);

  // gets existing text from firebase
  async function getText() {
    const channelDoc = await channelRef.get();
    const data = channelDoc.data();
    setText(data.text ?? '');
  }

  // saves text to firebase
  async function saveText() {
    await channelRef.update({ text });
  }

  // get text on start
  useEffect(() => {
    getText();
  }, []);

  // return if loading
  if (text === undefined) return <Loading />;

  return (
    <div className={styles.container}>
      <h1><DescriptionIcon fontSize="large" /> <span>{widget.name}</span></h1>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={saveText}>Save</button>
    </div>
  );
}
