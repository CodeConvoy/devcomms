import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';

import styles from '../styles/pages/Setup.module.css';

export default function SignUp(props) {
  const { authed, currentUser } = props;

  const [username, setUsername] = useState('');

  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  // on error closed
  function onCloseError(event, reason) {
    if (reason !== 'clickaway') setIsError(false);
  }

  return (
    <div className="page-container">
      <div className="page-center">
        <h1>Create User</h1>
        <hr />
        <form onSubmit={e => {
          e.preventDefault();
          createUser();
        }}>
          <label>
            Username
            <input
              id="signup-username"
              className="darkinput"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <button className="bluebutton">Create User</button>
        </form>
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          onClose={onCloseError}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={onCloseError}
            severity="error"
          >
            {error}
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
}
