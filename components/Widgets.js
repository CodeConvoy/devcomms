import Todos from './Todos.js';
import Sketch from './Sketch.js';

import styles from '../styles/components/Widgets.module.css';

export default function Widgets(props) {
  const { group, channel } = props;

  return (
    <div className={styles.container}>
      <Todos group={group} channel={channel} />
      <Sketch group={group} channel={channel} />
    </div>
  );
}
