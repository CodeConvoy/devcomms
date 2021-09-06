import Modal from '@material-ui/core/Modal';
import Message from './Message.js';
import Loading from '../Loading.js';
import PublishIcon from '@material-ui/icons/Publish';
import SendIcon from '@material-ui/icons/Send';

import { useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/app';

import styles from '../../styles/components/channels/Chat.module.css';

// delay in seconds before a new header
const headerOffset = 60 * 5;

// messages to be loaded in at a time
const messageChunk = 50;

export default function Chat(props) {
  const { messagesRef, currentUser } = props;

  const [text, setText] = useState('');
  const [file, setFile] = useState(undefined);

  const messagesEnd = useRef();
  const container = useRef();

  const uid = firebase.auth().currentUser.uid;

  // retrieve channel messages
  const [messageCount, setMessageCount] = useState(messageChunk);
  const messagesQuery = messagesRef.orderBy('sent').limitToLast(messageCount);
  const [messagesRaw] = useCollectionData(messagesQuery, { idField: 'id' });
  const [messages, setMessages] = useState(undefined);

  // creates new message doc in firebase
  async function sendMessage() {
    // return if empty or whitespace
    if (!text.trim()) return;
    setText('');
    await messagesRef.add({
      text: text,
      type: 'text',
      sender: uid,
      username: currentUser.username,
      sent: new Date()
    });
  }

  // sends file as message
  async function sendFile() {
    // if no file, return
    if (!file) return;
    // clear file
    setFile(undefined);
    // put file in storage and get url
    const filePath = `chat/${uuid()}`;
    const fileRef = firebase.storage().ref(filePath);
    const snapshot = await fileRef.put(file);
    const url = await snapshot.ref.getDownloadURL();
    // add file message
    await messagesRef.add({
      url: url,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      filename: file.name,
      sender: uid,
      username: currentUser.username,
      sent: new Date()
    });
  }

  // if container scrolled to top, load more messages
  function handleScroll(e) {
    const scrollY = container.current.scrollTop;
    if (scrollY === 0 && messageCount <= messages.length) {
      setMessageCount(messageCount + messageChunk);
    }
  }

  // scroll to end of messages
  function scrollToEnd() {
    if (messagesEnd.current) messagesEnd.current.scrollIntoView();
  }

  // scroll page when messages update
  useEffect(scrollToEnd, [messages]);

  // set messages if valid
  useEffect(() => {
    if (messagesRaw) setMessages(messagesRaw);
  }, [messagesRaw]);

  // return if loading
  if (!messages) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.messages} ref={container} onScroll={handleScroll}>
        {
          messages.map((message, i) =>
            <Message
              showHeader={
                i === 0 ||
                message.sender !== messages[i - 1].sender ||
                message.sent - messages[i - 1].sent > headerOffset
              }
              message={message}
              messagesRef={messagesRef}
              scroll={scroll}
              key={message.id}
            />
          )
        }
        <span ref={messagesEnd} />
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage();
      }}>
        <label htmlFor="fileinput" className={styles.filebutton}>
          <PublishIcon />
        </label>
        <input
          type="file"
          id="fileinput"
          onChange={e => setFile(e.target.files[0])}
          className={styles.fileinput}
        />
        <input
          className={styles.textinput}
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <button className={styles.sendbutton}>
          <SendIcon />
        </button>
      </form>
      <Modal
        open={!!file}
        onClose={() => setFile(undefined)}
      >
        {
          file ?
          <div className="modal">
            <h1>Send File</h1>
            <p>{file.name} ({file.type})</p>
            <div>
              {
                file.type.startsWith('image/') &&
                // using an img element here because of unknown size
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(file)}
                  className={styles.image}
                />
              }
            </div>
            <button className="iconbutton2" onClick={sendFile}>
              <SendIcon />
            </button>
          </div> :
          <div>Loading file...</div>
        }
      </Modal>
    </div>
  );
}
