import Loading from '../../components/Loading.js';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import getUserData from '../../util/getUserData.js';

export default function UserPage() {
  const router = useRouter();
  const { username } = router.query;

  const [userData, setUserData] = useState(undefined);

  // get user data on start
  useEffect(async () => {
    if (!username) return;
    const data = await getUserData(username);
    setUserData(data);
  }, [username]);

  // return if invalid user data
  if (userData === undefined) return <Loading />;
  if (!userData) return <div>No user found</div>;

  return (
    <div>
      <h1>{userData.username}</h1>
      <p>Joined {userData.joined.toDate().toLocaleDateString()}</p>
    </div>
  );
}
