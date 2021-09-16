import BaseSnackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default function Snackbar(props) {
  const { type, message, open, setOpen } = props;

  // on snackbar closed
  function onClose(event, reason) {
    if (reason !== 'clickaway') setOpen(false);
  }

  return (
    <BaseSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={type}
      >
        {message}
      </MuiAlert>
    </BaseSnackbar>
  );
}
