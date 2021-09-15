import BaseSnackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default function Snackbar(props) {
  const { error, isError, setIsError } = props;

  // on error closed
  function onCloseError(event, reason) {
    if (reason !== 'clickaway') setIsError(false);
  }

  return (
    <BaseSnackbar
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
    </BaseSnackbar>
  );
}
