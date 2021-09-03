import Todo from './Todo.js';
import Loading from '../Loading.js';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import firebase from 'firebase/app';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../../styles/components/widgets/Todos.module.css';

export default function Todos(props) {
  const { group, widget } = props;

  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState(undefined);
  const [isDue, setIsDue] = useState(null);

  // retrieve todos reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(widget.id);
  const todosRef = channelRef.collection('todos');

  const [todos] = useCollectionData(todosRef, { idField: 'id' });

  // creates a new todo
  async function createTodo() {
    resetModal();
    await todosRef.add({
      title: title,
      description: description,
      due: due ? due.replaceAll('-', '/') : null
    });
  }

  // swaps todo orders
  function reorderTodos(indexA, indexB) {
    const [removed] = todos.splice(indexA, 1);
    todos.splice(indexB, 0, removed);
    updateOrder();
  }

  // called after todo drag ends
  function onDragEnd(result) {
    if (!result.destination) return; // out of bounds
    if (result.source.index === result.destination.index) return; // same spot
    reorderTodos(result.source.index, result.destination.index);
  }

  // resets modal
  function resetModal() {
    setTitle('');
    setDescription('');
    setDue(null);
    setModalOpen(false);
  }

  // return if loading
  if (!todos) return <Loading />;

  return (
    <div className={styles.container}>
      <h1><ListIcon fontSize="large" /><span>{widget.name}</span></h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-todos">
          {
            (provided, snapshot) =>
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {
                todos.map((todo, i) =>
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id}
                    index={i}
                  >
                    {
                      (provided, snapshot) =>
                      <div
                        className={styles.todocontainer}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Todo
                          todo={todo}
                          todosRef={todosRef}
                          deleteOrder={deleteOrder}
                        />
                      </div>
                    }
                  </Draggable>
                )
              }
              {provided.placeholder}
            </div>
          }
        </Droppable>
      </DragDropContext>
      <button className="iconbutton3" onClick={() => setModalOpen(true)}>
        <AddIcon />
      </button>
      <Modal
        open={modalOpen}
        onClose={resetModal}
      >
        <div className="modal">
          <h1>New Todo</h1>
          <form onSubmit={createTodo}>
            <input
              value={title}
              className="darkinput"
              onChange={e => setTitle(e.target.value)}
              placeholder="title"
              required
            />
            <input
              value={description}
              className={`${styles.descinput} darkinput`}
              onChange={e => setDescription(e.target.value)}
              placeholder="description"
              required
            />
            <label htmlFor="todos-isdue">Due date?</label>
            <input
              id="todos-isdue"
              type="checkbox"
              className={styles.duecheck}
              checked={isDue}
              onChange={e => {
                const newIsDue = e.target.checked;
                setIsDue(newIsDue);
                setDue(newIsDue ? new Date() : null);
              }}
            />
            {
              isDue &&
              <input
                className={`${styles.dateinput} darkinput`}
                type="date"
                value={due}
                onChange={e => setDue(e.target.value)}
                required
              />
            }
            <button className="iconbutton2">
              <AddIcon />
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
