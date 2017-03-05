import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormBuilder } from 'components';
import Helmet from 'react-helmet';
import { updateCanvase, resetCanvase, setSelectedElement } from 'redux/modules/formbuilder';

class FormBuilderPage extends Component {

  static propTypes = {
    updateCanvase: PropTypes.func.isRequired,
    formState: PropTypes.array,
    selectedElement: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
    resetForm: PropTypes.func.isRequired,
    setSelectedElem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    formState: [],
  }

  state = {}

  render() {
    return (
      <div className="container">
        <Helmet title="Form Builder" />
        <div className="row">
          <div className="col-md-12">
            <div className="form-horizontal">
              <div className="form-group">
                <label htmlFor="exampleInputName2" className="col-md-2 control-label">FORM NAME</label>
                <div className="col-md-8">
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-2">
                  <div className="btn-group">
                    <button
                      onClick={this.props.resetForm}
                      className="btn btn-default">RESET</button>
                    <button
                      className="btn btn-default btn-primary">SAVE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <FormBuilder
              formState={this.props.formState}
              selectElement={this.props.setSelectedElem}
              selectedElement={this.props.selectedElement}
              updateCanvase={this.props.updateCanvase} />
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  formState: state.formbuilder.form,
  selectedElement: state.formbuilder.selectedElement
});

const mapDispatchToProps = (dispatch) => ({
  updateCanvase: (form) => dispatch(updateCanvase(form)),
  setSelectedElem: (id) => dispatch(setSelectedElement(id)),
  resetForm: () => dispatch(resetCanvase())
});


export default connect(mapStateToProps, mapDispatchToProps)(FormBuilderPage);
