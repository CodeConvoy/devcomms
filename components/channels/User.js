import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';

import styles from '../../styles/components/channels/User.module.css';

export default function User(props) {
  const { user, currUser, setCurrUser, removeFriend } = props;

  return (
    <div
      className={
        currUser?.uid === user.uid ?
        `${styles.container} ${styles.selected}` :
        styles.container
      }
      onClick={() => setCurrUser(user)}
      key={user.uid}
    >
      <div>{user.username}</div>
      <Tooltip title="Remove Friend" arrow>
        <button onClick={e => {
          e.stopPropagation();
          removeFriend(user);
        }}>
          <ClearIcon fontSize="small" />
        </button>
      </Tooltip>
    </div>
  );
}
