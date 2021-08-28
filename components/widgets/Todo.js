import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useState } from 'react';

import styles from '../../styles/components/widgets/Todo.module.css';

export default function Todo(props) {
  const { title, description, due, id, todosRef } = props;

  const todoRef = todosRef.doc(id);

  const [modalOpen, setModalOpen] = useState(false);

  // deletes todo
  async function deleteTodo() {
    if (window.confirm('Really delete todo?')) await todoRef.delete();
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {due && <p>Due {due.toDate().toLocaleDateString()}}</p>}
      <button onClick={() => setOpen(true)}>
        <EditIcon fontSize="small" />
      </button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modal">
          <h1>Editing Todo</h1>
          <button onClick={deleteTodo}>
            <DeleteIcon />
          </button>
        </div>
      </Modal>
    </div>
  );
}
