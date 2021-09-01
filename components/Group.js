import SettingsIcon from '@material-ui/icons/Settings';

import styles from '../styles/Group.module.css';

import firebase from 'firebase/app';

export default function Group(props) {
  const { group, currGroup, setCurrGroup, selectStyle } = props;

  const uid = firebase.auth().currentUser.uid;

  return (
    <div
      className={
        currGroup === group.id ?
        `${styles.container} ${selectStyle}` : styles.container
      }
      onClick={() => setCurrGroup(group.id)}
      key={group.id}
    >
      <div>{group.name}</div>
      {
        uid === group.creator &&
        <button onClick={e => e.stopPropagation()}>
          <SettingsIcon fontSize="small" />
        </button>
      }
    </div>
  );
}
