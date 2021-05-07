import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  mainContainer: {
    maxWidth: 500,
    background: theme.palette.custom.background.main,
    color: 'white',
  },
  mainContent: {
    padding: 0,
  },
  box: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  uploadBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 180,
    borderRadius: 4,
    padding: theme.spacing(4),
  },
  uploadBoxInner: {
    marginTop: 108,
    color: 'white',
  },
  uploadIcon: {
    position: 'absolute',
    fontSize: '13rem',
    opacity: .35
  }
}));

export default useStyles