import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';

export default function User(props) {
  const { user, currUser, setCurrUser, removeFriend, styles } = props;

  return (
    <div
      className={currUser?.uid === user.uid ? styles.selected : undefined}
      onClick={() => setCurrUser(user)}
      key={user.uid}
    >
      <div>{user.username}</div>
      <Tooltip title="Remove Friend" arrow>
        <button className={styles.removebutton} onClick={e => {
          e.stopPropagation();
          removeFriend(user);
        }}>
          <ClearIcon fontSize="small" />
        </button>
      </Tooltip>
    </div>
  );
}
