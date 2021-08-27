import styles from '../styles/components/Sketch.module.css';
import { useEffect, useRef } from 'react';

// width and height of canvas
const width = 256;
const height = 256;

let canvas, ctx;

export default function Sketch(props) {
  const { group, channel } = props;

  const canvasRef = useRef();

  // retrieve sketch reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);
  const widgetsRef = channelRef.colection('widgets');
  const sketchRef = widgetsRef.doc('sketch');

  // retrieve canvas context on start
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
}
