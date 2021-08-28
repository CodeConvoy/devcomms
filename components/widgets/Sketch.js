import styles from '../styles/components/Sketch.module.css';
import { useEffect, useRef, useState } from 'react';

// width and height of canvas
const width = 256;
const height = 256;

let canvas, ctx;

let sketching = false;

let prevX, prevY;
let currX, currY;

export default function Sketch(props) {
  const { group, channel } = props;

  const [lineColor, setLineColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(2);

  const canvasRef = useRef();

  // retrieve sketch reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const channelsRef = groupRef.collection('channels')
  const channelRef = channelsRef.doc(channel);
  const widgetsRef = channelRef.colection('widgets');
  const sketchRef = widgetsRef.doc('sketch');

  // sketches canvas with given mouse event data
  function sketch(e) {
    // get previous and current mouse positions
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft + window.scrollX;
    currY = e.clientY - canvas.offsetTop + window.scrollY;
    // return if no previous data
    if (prevX === undefined || prevY === undefined) return;
    // draw stroke
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  }

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
        onMouseDown={e => { sketching = true; sketch(e); }}
        onMouseMove={e => { if (sketching) sketch(e); }}
        onMouseUp={e => { sketching = false; }}
        onMouseLeave={e => { sketching = false; }}
      />
    </div>
  );
}
