import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import ListIcon from '@material-ui/icons/List';
import Tooltip from '@material-ui/core/Tooltip';

import { useEffect, useState } from 'react';
import newDateString from '../../util/newDateString.js';

import styles from '../../styles/components/widgets/Todo.module.css';

const SEC_MS = 1000;
const MIN_MS = SEC_MS * 60;
const HOUR_MS = MIN_MS * 60;
const DAY_MS = HOUR_MS * 24;

export default function Todo(props) {
  const { todosRef, deleteOrder } = props;
  const { title, description, due, order, id } = props.todo;
  const dueDate = due ? new Date(due) : undefined;

  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newDue, setNewDue] = useState(due ? due.replaceAll('/', '-') : null);

  const todoRef = todosRef.doc(id);

  const [modalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(dueDate - new Date());

  // deletes todo
  async function deleteTodo() {
    // confirm delete
    if (!window.confirm(`Delete ${title}?`)) return;
    // delete todo
    setModalOpen(false);
    await deleteOrder(order);
    await todoRef.delete();
  }

  // updates todo
  async function updateTodo() {
    setModalOpen(false);
    await todoRef.update({
      title: newTitle,
      description: newDescription,
      due: newDue ? newDue.replaceAll('-', '/') : null
    });
  }

  // resets modal
  function resetModal() {
    setNewTitle(title);
    setNewDescription(description);
    setNewDue(due ? due.replaceAll('/', '-') : null);
  }

  useEffect(() => {
    // update time left every tenth of a second
    setTimeLeft(dueDate - new Date());
    const interval = setInterval(() => {
      setTimeLeft(dueDate - new Date());
    }, 100);
    return () => clearInterval(interval);
  }, [due]);

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
      <button className="iconbutton3" onClick={() => {
        resetModal();
        setModalOpen(true);
      }}>
        <EditIcon fontSize="small" />
      </button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal">
          <h1>Editing<ListIcon />{title}</h1>
          <form onSubmit={e => {
            e.preventDefault();
            updateTodo();
          }}>
            <input
              value={newTitle}
              className="darkinput"
              onChange={e => setNewTitle(e.target.value)}
              placeholder="title"
              required
            />
            <input
              value={newDescription}
              className={`${styles.descinput} darkinput`}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="description"
              required
            />
            <label htmlFor="todos-isdue">Due date?</label>
            <input
              id="todos-isdue"
              type="checkbox"
              className={styles.duecheck}
              checked={!!newDue}
              onChange={e => setNewDue(e.target.checked ? newDateString() : null)}
            />
            {
              newDue &&
              <input
                className={`${styles.dateinput} darkinput`}
                type="date"
                value={newDue}
                onChange={e => setNewDue(e.target.value)}
                required
              />
            }
            <Tooltip title="Save Changes" arrow>
              <button className="iconbutton2">
                <CheckIcon />
              </button>
            </Tooltip>
          </form>
          <Tooltip title="Delete Todo" arrow>
            <button
              className={`iconbutton2 ${styles.delbutton}`}
              onClick={deleteTodo}
            >
              <DeleteIcon />
            </button>
          </Tooltip>
        </div>
      </Modal>
    </div>
  );
}
