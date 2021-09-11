import BaseModal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import ClearIcon from '@material-ui/icons/Clear';

import styles from '../styles/Modal.module.css';

export default function Modal(props) {
  const { open, onClose } = props;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        className: styles.backdrop,
        timeout: 100
      }}
    >
      <Fade in={open} timeout={100}>
        <div className={styles.modal}>
          <button className={styles.close} onClick={onClose}>
            <ClearIcon />
          </button>
          {props.children}
        </div>
      </Fade>
    </BaseModal>
  );
}
