import Modal from '../Modal.js';
import SettingsIcon from '@material-ui/icons/Settings';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import { useState } from 'react';
import getIcon from '../../util/getIcon.js';

import styles from '../../styles/components/channels/Channel.module.css';

export default function Channel(props) {
  const { channel, setCurrChannel, type, className, onClick, docRef } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(channel.name);

  // updates channel
  async function updateChannel() {
    setModalOpen(false);
    await docRef.update({ name });
  }

  // deletes channel
  async function deleteChannel() {
    // confirm delete
    if (!window.confirm(`Delete ${channel.name}?`)) return;
    // delete channel
    setModalOpen(false);
    setCurrChannel(undefined);
    await docRef.delete();
  }

  // resets modal
  function resetModal() {
    setName(channel.name);
  }

  return (
    <>
      <div
        className={`${styles.container} ${className}`}
        onClick={onClick}
      >
        {getIcon(type)}
        <span>{channel.name}</span>
        <span className={styles.flexfill} />
        <Tooltip title="Edit Channel" arrow>
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
        </Tooltip>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h1>Editing{getIcon(type)}<span>{channel.name}</span></h1>
        <form onSubmit={e => {
          e.preventDefault();
          updateChannel();
        }}>
          <div className="input-button">
            <input
              value={name}
              className="darkinput"
              onChange={e => setName(e.target.value)}
              placeholder="name"
              required
            />
            <Tooltip title="Save Changes" arrow>
              <button className="iconbutton2">
                <CheckIcon />
              </button>
            </Tooltip>
          </div>
        </form>
        <Tooltip title="Delete Channel" arrow>
          <button
            className={`iconbutton2 ${styles.delbutton}`}
            onClick={deleteChannel}
          >
            <DeleteIcon />
          </button>
        </Tooltip>
      </Modal>
    </>
  );
}
