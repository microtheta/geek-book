/* eslint-disable */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import getRoutes from 'routes';

export default class Root extends Component {
  routes = getRoutes(this.props.store);

  render() {
    return (
      <Provider store={this.props.store} key="provider">
        <Router
          {...this.props.renderProps} render={this.props.render} history={this.props.history}>
          { this.routes }
        </Router>
      </Provider>
    );
  }
}
