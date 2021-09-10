import Loading from '../Loading.js';
import DescriptionIcon from '@material-ui/icons/Description';
import SaveIcon from '@material-ui/icons/Save';

import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import styles from '../../styles/components/widgets/Notes.module.css';

// save timeout in milliseconds
const saveDelay = 250;

export default function Notes(props) {
  const { group, widget } = props;

  const [text, setText] = useState(undefined);

  // retrieve notes reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const widgetsRef = groupRef.collection('widgets')
  const widgetRef = widgetsRef.doc(widget.id);
  const [widgetData] = useDocumentData(widgetRef);

  // saves text to firebase
  async function saveText() {
    await widgetRef.update({ text });
  }

  // save text on update
  useEffect(() => {
    const saveTimeout = setTimeout(saveText, saveDelay);
    return () => clearTimeout(saveTimeout);
  }, [text]);

  // set text when widget data changes
  useEffect(() => {
    setText(widgetData?.text ?? '');
  }, [widgetData]);

  // return if loading
  if (text === undefined) return <Loading />;

  return (
    <div className={styles.container}>
      <h1><DescriptionIcon fontSize="large" /> <span>{widget.name}</span></h1>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={12} />
    </div>
  );
}
