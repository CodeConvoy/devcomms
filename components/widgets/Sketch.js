import Loading from '../Loading.js';
import GetAppIcon from '@material-ui/icons/GetApp';
import BrushIcon from '@material-ui/icons/Brush';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import GestureIcon from '@material-ui/icons/Gesture';

import firebase from 'firebase/app';
import { useEffect, useRef, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import styles from '../../styles/components/widgets/Sketch.module.css';

// width and height of canvas
const width = 256;
const height = 256;

let canvas, ctx;

let sketching = false;

let prevX, prevY;
let currX, currY;

export default function Sketch(props) {
  const { group, widget } = props;

  const [lineColor, setLineColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(2);
  const [loaded, setLoaded] = useState(false);

  const canvasRef = useRef();

  // retrieve sketch reference
  const groupsRef = firebase.firestore().collection('groups');
  const groupRef = groupsRef.doc(group);
  const widgetsRef = groupRef.collection('widgets')
  const widgetRef = widgetsRef.doc(widget.id);
  const [widgetData] = useDocumentData(widgetRef);

  // sketches canvas with given mouse event data
  function sketch(e, doDraw) {
    // get previous and current mouse positions
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft + window.scrollX;
    currY = e.clientY - canvas.offsetTop + window.scrollY;
    // return if not drawing
    if (!doDraw) return;
    // draw stroke
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  }

  // downloads canvas as a png
  function downloadCanvas() {
    // get canvas object url
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      // download from link element
      const link = document.createElement('a');
      link.download = 'sketch.png';
      link.href = url;
      link.click();
    });
  }

  // saves canvas to firebase
  async function saveCanvas() {
    const sketch = canvas.toDataURL();
    await widgetRef.update({ sketch });
  }

  // retrieve canvas from firebase
  async function getCanvas() {
    // get sketch
    const sketch = widgetData.sketch;
    // load image if sketch
    if (sketch) {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        setLoaded(true);
      }
      image.src = sketch;
    } else {
      // fill with white
      ctx.rect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.fill();
      setLoaded(true);
    }
  }

  // clears canvas
  function clearCanvas() {
    // confirm delete
    if (!window.confirm('Clear canvas?')) return;
    // fill with white
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fill();
    // save in firebase
    saveCanvas();
  }

  // retrieve canvas context on start
  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  }, []);

  // set text when widget data changes
  useEffect(() => {
    if (widgetData) getCanvas();
  }, [widgetData]);

  return (
    <>
      {!loaded && <Loading />}
      <div
        className={styles.container}
        style={ loaded ? undefined : { display: 'none'}}
      >
        <h1><BrushIcon fontSize="large" /> <span>{widget.name}</span></h1>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={e => { sketching = true; sketch(e, false); }}
          onMouseMove={e => { if (sketching) sketch(e, true); }}
          onMouseUp={e => { sketching = false; saveCanvas(); }}
          onMouseLeave={e => { sketching = false; saveCanvas(); }}
        />
        <button
          className={`${lineColor === 'black' && styles.selected} iconbutton3`}
          onClick={() => setLineColor(
            lineColor === 'white' ? 'black' : 'white'
          )}
        >
          <GestureIcon />
        </button>
        <button className="iconbutton3" onClick={clearCanvas}>
          <DeleteIcon />
        </button>
        <button className="iconbutton3" onClick={downloadCanvas}>
          <GetAppIcon />
        </button>
      </div>
    </>
  );
}
