import styles from '../styles/Message.module.css';

export default function Message(props) {
  const { text } = props;

  return (
    <div>{text}</div>
  );
}
