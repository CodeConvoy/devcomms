import Modal from '@material-ui/core/Modal';
import SettingsIcon from '@material-ui/icons/Settings';

import getIcon from '../../util/getIcon.js';

import styles from '../../styles/components/channels/Channel.module.css';

export default function Channel(props) {
  const { channel, type, className, onClick, Icon } = props;

  return (
    <div
      className={`${styles.container} ${className}`}
      onClick={onClick}
    >
      {getIcon(type)}
      <span>{channel.name}</span>
      <button className={styles.editbutton} onClick={() => {}}>
        <SettingsIcon />
      </button>
    </div>
  );
}
