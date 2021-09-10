import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import Modal from '@material-ui/core/Modal';

import { useState } from 'react';

import styles from '../styles/Feedback.module.css';

export default function Feedback() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button className={styles.feedbackbtn} onClick={() => setModalOpen(true)}>
        <ChatBubbleIcon />
      </button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="muimodal">
          <h1>Contact Us</h1>
          <p>Feel free to send us feedback, bug reports, or ideas. We would love
          to hear from you!</p>
          <form
            action="https://formspree.io/f/myyllqwb"
            method="POST"
            className={styles.form}
          >
            <label>
              Name<br />
              <input
                className="darkinput"
                type="text"
                name="name"
                maxLength="100"
                required
              />
            </label>
            <label>
              Email<br />
              <input
                className="darkinput"
                type="email"
                name="email"
                maxLength="100"
                required
              />
            </label>
            <label>
              Message<br />
              <textarea
                className="darkinput"
                name="message"
                rows="4"
                maxLength="10000"
                required
              />
            </label>
            <button className="iconbutton2" type="submit">
              <SendIcon />
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
