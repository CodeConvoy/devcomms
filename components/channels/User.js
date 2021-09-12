import Image from 'next/image';
import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';

import styles from '../../styles/components/channels/User.module.css';

export default function User(props) {
  const { user, currUser, setCurrUser, removeFriend } = props;

  return (
    <Tooltip title={user.username} arrow>
      <div
        className={
          currUser?.uid === user.uid ?
          `${styles.container} ${styles.selected}` :
          styles.container
        }
        onClick={() => setCurrUser(user)}
        key={user.uid}
      >
        <Image src={user.photo} width="60" height="60" alt="avatar" />
        <Tooltip title="Remove Friend" arrow>
          <button onClick={e => {
            e.stopPropagation();
            removeFriend(user);
          }}>
            <ClearIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>
    </Tooltip>
  );
}
