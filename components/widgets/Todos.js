import Todo from './Todo.js';
import Loading from '../Loading.js';
import Modal from '../Modal';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import Tooltip from '@material-ui/core/Tooltip';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import firebase from 'firebase/app';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import newDateString from '../../util/newDateString.js';

import styles from '../../styles/components/widgets/Todos.module.css';

export default function Todos(props) {
  const { group, widget } = props;

  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState(null);

  // retrieve todos reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const widgetsRef = groupRef.collection('widgets')
  const widgetRef = widgetsRef.doc(widget.id);
  const todosRef = widgetRef.collection('todos');

  const [todos] = useCollectionData(
    todosRef.orderBy('order'), { idField: 'id' }
  );

  // creates a new todo
  async function createTodo() {
    setModalOpen(false);
    await todosRef.add({
      title: title,
      description: description,
      due: due ? due.replaceAll('-', '/') : null,
      order: todos.length
    });
  }

  // updates todo orders in firebase
  async function updateOrder() {
    const batch = firebase.firestore().batch(); // create batch
    // for each todo
    await todos.forEach((todo, i) => {
      // update todo doc at id with order
      const todoDoc = todosRef.doc(todo.id);
      batch.update(todoDoc, { order: i });
    });
    batch.commit(); // commit batch
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
  }

  // splices todo at given order
  async function deleteOrder(order) {
    todos.splice(order, 1);
    await updateOrder();
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
      <Tooltip title="New Todo" arrow>
        <button
          className={`iconbutton3 ${styles.addbtn}`}
          onClick={() => {
            resetModal();
            setModalOpen(true);
          }}
        >
          <AddIcon />
        </button>
      </Tooltip>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h1>New Todo</h1>
        <form onSubmit={e => {
          e.preventDefault();
          createTodo();
        }}>
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
          <label>
            Due date?
            <input
              type="checkbox"
              className={styles.duecheck}
              checked={!!due}
              onChange={e => setDue(e.target.checked ? newDateString() : null)}
            />
          </label>
          {
            due &&
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
      </Modal>
    </div>
  );
}
