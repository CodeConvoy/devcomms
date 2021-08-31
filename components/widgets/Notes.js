import firebase from 'firebase/app';

import styles from '../../styles/components/widgets/Notes.module.css';

export default function Notes(props) {
  const { group, channel } = props;

  // retrieve notes reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);

  return (
    <div>
      <textarea rows={17} cols={30} />
    </div>
  );
}
