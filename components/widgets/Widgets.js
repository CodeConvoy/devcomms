import Todos from './Todos.js';
import Sketch from './Sketch.js';

import styles from '../styles/components/widgets/Widgets.module.css';

export default function Widgets(props) {
  const { group, channel } = props;

  const [showTodos, setShowTodos] = useState(true);
  const [showSketch, setShowSketch] = useState(true);

  return (
    <div className={styles.container}>
      <label htmlFor="widgets-showtodos">Todos</label>
      <input
        id="widgets-showtodos"
        type="checkbox"
        checked={showTodos}
        onChange={e => setShowTodos(!showTodos)}
      />
      <label htmlFor="widgets-showsketch">Sketch</label>
      <input
        id="widgets-showsketch"
        type="checkbox"
        checked={showSketch}
        onChange={e => setShowSketch(!showSketch)}
      />
      {showTodos && <Todos group={group} channel={channel} />}
      {showSketch && <Sketch group={group} channel={channel} />}
    </div>
  );
}
