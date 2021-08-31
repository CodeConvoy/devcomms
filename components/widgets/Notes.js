import DescriptionIcon from '@material-ui/icons/Description';

import firebase from 'firebase/app';

import styles from '../../styles/components/widgets/Notes.module.css';

export default function Notes(props) {
  const { group, widget } = props;

  // retrieve notes reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(widget.id);

  return (
    <div className={styles.container}>
      <h1><DescriptionIcon fontSize="large" /> <span>{widget.name}</span></h1>
      <textarea />
    </div>
  );
}
