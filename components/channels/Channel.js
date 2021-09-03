import Modal from '@material-ui/core/Modal';

import getIcon from '../../util/getIcon.js';

import styles from '../../styles/components/channels/Channel.module.css';

export default function Channel(props) {
  const { channel, type, className, onClick, Icon } = props;

  return (
    <button
      className={className}
      onClick={onClick}
    >
      {getIcon(type)}
      <span>{channel.name}</span>
    </button>
  );
}
