import styles from '../styles/components/Todo.module.css';

export default function Todo(props) {
  const { title, description, due, id } = props;

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {due && <p>Due {due.toDate().toLocaleDateString()}}</p>}
    </div>
  );
}
