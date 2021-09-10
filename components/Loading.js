import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../styles/components/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <CircularProgress />
    </div>
  );
}
