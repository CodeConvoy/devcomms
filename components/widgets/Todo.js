import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useEffect, useState } from 'react';

import styles from '../../styles/components/widgets/Todo.module.css';

const SEC_MS = 1000;
const MIN_MS = SEC_MS * 60;
const HOUR_MS = MIN_MS * 60;
const DAY_MS = HOUR_MS * 24;

export default function Todo(props) {
  const { title, description, due, id, todosRef } = props;
  const dueDate = due ? new Date(due) : undefined;

  const todoRef = todosRef.doc(id);

  const [modalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(dueDate - new Date());

  // deletes todo
  async function deleteTodo() {
    if (window.confirm('Really delete todo?')) {
      setModalOpen(false);
      await todoRef.delete();
    }
  }

  useEffect(() => {
    // update time left every tenth of a second
    setTimeLeft(dueDate - new Date());
    const interval = setInterval(() => {
      setTimeLeft(dueDate - new Date());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <p>{description}</p>
      {
        due &&
        <>
          <hr />
          <p>
            {
              dueDate.toLocaleString('default', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })
            }
          </p>
          <p className={timeLeft >= 0 ? styles.timeleft : `${styles.timeleft} ${styles.overdue}`}>
            {
              timeLeft >= 0 ?
              <>
                {timeLeft > DAY_MS && <>{Math.floor(timeLeft / DAY_MS)}<span>d</span></>}
                {timeLeft > HOUR_MS && <>{Math.floor(timeLeft % DAY_MS / HOUR_MS)}<span>h</span></>}
                {timeLeft > MIN_MS && <>{Math.floor(timeLeft % DAY_MS % HOUR_MS / MIN_MS)}<span>m</span></>}
                {Math.floor(timeLeft % DAY_MS % HOUR_MS % MIN_MS / SEC_MS)}<span>s</span>
              </> :
              <>
                {-timeLeft > DAY_MS && <>{Math.floor(-timeLeft / DAY_MS)}<span>d</span></>}
                {-timeLeft > HOUR_MS && <>{Math.floor(-timeLeft % DAY_MS / HOUR_MS)}<span>h</span></>}
                {-timeLeft > MIN_MS && <>{Math.floor(-timeLeft % DAY_MS % HOUR_MS / MIN_MS)}<span>m</span></>}
                {Math.floor(-timeLeft % DAY_MS % HOUR_MS % MIN_MS / SEC_MS)}<span>s</span>
                ago
              </>
            }
          </p>
        </>
      }
      <button className="iconbutton3" onClick={() => setModalOpen(true)}>
        <EditIcon fontSize="small" />
      </button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal">
          <h1>Editing Todo</h1>
          <button className="iconbutton2" onClick={deleteTodo}>
            <DeleteIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
}
