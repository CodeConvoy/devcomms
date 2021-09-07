import Router from 'next/router';

import styles from '../styles/pages/Reset.module.css';

export default function Reset(props) {
  const { currentUser } = props;

  // listen for user auth
  useEffect(() => {
    if (currentUser) Router.push('/home');
  }, [currentUser]);

  return (
    <div>
    </div>
  );
}
