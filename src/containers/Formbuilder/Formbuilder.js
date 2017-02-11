import React, { Component } from 'react';
import { FormBuilder } from 'components';
import Helmet from 'react-helmet';

export default class FormBuilderPage extends Component {
  state = {}

  render() {
    return (
      <div className="container">
        <Helmet title="Form Builder" />
        <FormBuilder />
      </div>
    );
  }
}
