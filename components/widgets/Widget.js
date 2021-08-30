import Todos from './Todos.js';
import Sketch from './Sketch.js';

import styles from '../../styles/components/widgets/Widget.module.css';

export default function Widget(props) {
  const { group, widget } = props;

  // returns component for widget type
  function getWidgetComponent() {
    switch (widget.type) {
      case 'todos': return Todos;
      case 'sketch': return Sketch;
      default: return null;
    }
  }

  // returns component for widget
  function getWidget() {
    const Component = getWidgetComponent();
    return <Component group={group} channel={widget.id} />;
  }

  return (
    <div>
      {getWidget()}
    </div>
  );
}
