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
      <button
        className={styles.editbutton}
        onClick={e => {
          e.stopPropagation();
          resetModal();
          setModalOpen(true);
        }}
      >
        <SettingsIcon />
      </button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal">
          <h1>Editing {channel.name}</h1>
          <form onSubmit={e => {
            e.preventDefault();
            updateChannel();
          }}>
            <input
              value={name}
              className={`${styles.nameinput} darkinput`}
              onChange={e => setName(e.target.value)}
              placeholder="name"
              required
            />
            <button className="iconbutton2">
              <CheckIcon />
            </button>
          </form>
          <button
            className={`iconbutton2 ${styles.delbutton}`}
            onClick={deleteChannel}
          >
            <DeleteIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
}
