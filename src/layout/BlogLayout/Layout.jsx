import React from 'react';
import PropTypes from 'prop-types';

import ThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import globalTheme from '../../styles/theme';

import WaveBackgroundAni from '../../components/WaveAniBackground';

import { Provider } from './Context';
import AppBar from './AppBar';
import Drawer, { drawerWidth } from './Drawer';

class BlogLayout extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    profile: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
  };

  static defaultProps = {
    title: '',
    profile: {},
    categories: {},
  };

  constructor(props) {
    super(props);

    this.state = { isOpenDrawer: false };
    this.backgroundRef = React.createRef();

    this.onScroll = this.onScroll.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer(event) {
    event.preventDefault();
    this.setState(prevState => ({
      ...prevState,
      isOpenDrawer: !prevState.isOpenDrawer,
    }));
  }

  onScroll(event) {
    const { scrollTop } = event.target.scrollingElement;
    const target = this.backgroundRef.current;

    if (scrollTop === 0) {
      target.runAnimation();
    } else if (target.requestAnimationFrameId !== 0) {
      this.backgroundRef.current.stopAnimation();
    } else {
      this.backgroundRef.current.updateBackground();
    }
  }

  componentDidMount() {
    this.backgroundRef.current.runAnimation();
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  render() {
    const { classes, title, categories, profile, children } = this.props;
    const { isOpenDrawer } = this.state;

    return (
      <Provider
        value={{
          title: title,
          categories,
          isOpenDrawer,
          toggleDrawer: this.toggleDrawer,
          profile,
        }}
      >
        <ThemeProvider theme={globalTheme}>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar />
            <Drawer />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              {children}
            </main>
          </div>
          <WaveBackgroundAni ref={this.backgroundRef} />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default withStyles(theme => ({
  root: {
    display: 'flex',
    position: 'relative',
  },
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: globalTheme.palette.primary.main,
    zIndex: -999,
    position: 'absolute',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    width: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
    },
  },
}))(BlogLayout);
