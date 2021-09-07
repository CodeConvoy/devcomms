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
      <div>
        <h1>Reset Password</h1>
        <form onSubmit={e => {
          e.preventDefault();
          resetPassword();
        }}>
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button>Reset Password</button>
        </form>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </div>
    </div>
  );
}
