import styles from '../styles/components/Sketch.module.css';

export default function Sketch(props) {
  const { group, channel } = props;

  // retrieve sketch reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);
  const widgetsRef = channelRef.colection('widgets');
  const sketchRef = widgetsRef.doc('sketch');

  return (
    <div>
    </div>
  );
}
