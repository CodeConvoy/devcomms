import Loading from '../Loading.js';
import DescriptionIcon from '@material-ui/icons/Description';
import SaveIcon from '@material-ui/icons/Save';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';

import styles from '../../styles/components/widgets/Notes.module.css';

export default function Notes(props) {
  const { group, widget } = props;

  const [text, setText] = useState(undefined);

  // retrieve notes reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const widgetsRef = groupRef.collection('widgets')
  const widgetRef = widgetsRef.doc(widget.id);

  // gets existing text from firebase
  async function getText() {
    const widgetDoc = await widgetRef.get();
    const data = widgetDoc.data();
    setText(data.text ?? '');
  }

  // saves text to firebase
  async function saveText() {
    await widgetRef.update({ text });
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
      <button className="iconbutton3" onClick={saveText}>
        <SaveIcon />
      </button>
    </div>
  );
}
