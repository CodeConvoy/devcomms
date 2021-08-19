// returns an error message based on given error
export default function getError(error) {
  switch (error.code) {
    case 'auth/invalid-email': return 'Invalid email address.';
    case 'auth/user-not-found': return 'Unknown email address.';
    case 'auth/email-already-in-use': return 'Email already in use.';
    case 'auth/wrong-password': return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests': return 'Too many requests. Please try again later.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    default: return error.message;
  }
}
