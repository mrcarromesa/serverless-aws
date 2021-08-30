import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({

  // overrides: {
  //   MuiButton: {
  //     text: {
  //       // Some CSS
  //       background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  //       borderRadius: 3,
  //       border: 0,
  //       color: 'white',
  //       height: 48,
  //       padding: '0 30px',
  //       boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  //     },
  //   },
  // },

  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
