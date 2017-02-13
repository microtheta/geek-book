import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Alert from 'react-bootstrap/lib/Alert';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { Notifs } from 'components';
import { push } from 'react-router-redux';
import config from 'config';
import { asyncConnect } from 'redux-connect';
import 'todc-bootstrap/dist/css/todc-bootstrap.css';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    notifs: state.notifs,
    user: state.auth.user
  }),
  { logout, pushState: push })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    user: PropTypes.object,
    notifs: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static defaultProps = {
    user: null
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      const redirect = this.props.router.location.query && this.props.router.location.query.redirect;
      this.props.pushState(redirect || '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const { user, notifs, children } = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Navbar fixedTop inverse className={styles['navbar-default']}>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{ color: '#33e0ff' }}>
                <div className={styles.brand}>
                </div>
                {/* <i className="fa fa-medium fa-2x"></i>
                <span>{config.app.title}</span>*/}
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav navbar>
              {user && <LinkContainer to="/chatFeathers">
                <NavItem>Chat with Feathers</NavItem>
              </LinkContainer>}

              {/* <LinkContainer to="/chat">
                <NavItem>Chat</NavItem>
              </LinkContainer>
              <LinkContainer to="/widgets">
                <NavItem>Widgets</NavItem>
              </LinkContainer>
              <LinkContainer to="/survey">
                <NavItem>Survey</NavItem>
              </LinkContainer>*/}
              <LinkContainer to="/about">
                <NavItem>ABOUT</NavItem>
              </LinkContainer>
              <LinkContainer to="/formbuilder">
                <NavItem>FORM</NavItem>
              </LinkContainer>

              {!user && <LinkContainer to="/login">
                <NavItem>LOGIN</NavItem>
              </LinkContainer>}
              {!user && <LinkContainer to="/register">
                <NavItem>SIGN UP</NavItem>
              </LinkContainer>}
              {user && <LinkContainer to="/logout">
                <NavItem className="logout-link" onClick={this.handleLogout}>
                  LOGOUT
                </NavItem>
              </LinkContainer>}
            </Nav>
            {user && <p className="navbar-text">
              Logged in as <strong>{user.email}</strong>.
            </p>}
            <Nav navbar pullRight>
              <NavItem
                target="_blank" title="View on Github"
                href="https://github.com/thumarmahesh/geek-book"
              >
                <i className="fa fa-github" />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {notifs.global && <div className="container">
            <Notifs
              className={styles.notifs}
              namespace="global"
              NotifComponent={props => <Alert bsStyle={props.kind}>{props.message}</Alert>}
            />
          </div>}

          {children}
        </div>

        <div className="well text-center">
          Have questions? Ask for help{' '}
          <a
            href="http://microtheta.com/#contact"
            target="_blank" rel="noopener noreferrer"
          >
            here.
         </a>
        </div>
      </div>
    );
  }
}
