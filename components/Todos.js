import Todo from './Todo.js';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import styles from '../styles/components/Todos.module.css';

export default function Todos(props) {
  const { group, channel } = props;

  // retrieve todos reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);
  const widgetsRef = channelRef.colection('widgets');
  const todosRef = widgetsRef.doc('todos').collection('todos');

  const [todos] = useCollectionData(todosRef, { idField: 'id' });

  return (
    <div>
      {
        todos.map(todo =>
          <Todo {...todo} key={todo.id} />
        )
      }
    </div>
  );
}
