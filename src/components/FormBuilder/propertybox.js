import React, { Component, PropTypes } from 'react';
// import update from 'react/lib/update';
import _ from 'lodash';

class PropBoxComponent extends Component {

  static propTypes = {
    element: PropTypes.any,
    onPropertyChage: PropTypes.func
  };

  static defaultProps = {
    element: null,
    onPropertyChage: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      formdata: this.props.element,
      updateData: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOptionsChange = this.handleOptionsChange.bind(this);
    this.renderOptionsBox = this.renderOptionsBox.bind(this);
    this.createOption = this.createOption.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    if (newProps.element) {
      this.setState({
        formdata: newProps.element
      });
    }
  }

  handleChange(val, attr) {
    const dict = { ...this.state };
    dict.formdata[attr] = val;
    this.setState(dict);
    this.props.onPropertyChage(dict.formdata);
  }

  handleOptionsChange(val, index) {
    const opts = [...this.state.formdata.options];
    opts[index] = val;
    this.handleChange(opts, 'options');
  }

  createOption() {
    // remove all blank options and push new option
    const optList = _.uniq(this.state.formdata.options);
    optList.push('');
    this.state.formdata.options = optList;
    this.setState(this.state.formdata);
  }

  removeOption(index) {
    const optList = [...this.state.formdata.options];
    optList.splice(index, 1);
    this.handleChange(optList, 'options');
  }

  renderOptionsBox() {
    const { options } = this.state.formdata;
    return (
      <div className="">
        <label htmlFor="options"> Options </label>
        {
          options.map((option, i) => ([
            <div>
              <div className="input-group">
                <input
                  className="form-control"
                  type="text" name={`option_${i}`} placeholder={`option ${i + 1}`}
                  value={option}
                  onChange={(e) => { this.handleOptionsChange(e.target.value, i); }}
                />
                <span className="input-group-btn" onClick={() => { this.removeOption(i); }}>
                  <button type="button" className="btn btn-default">
                    <span className="glyphicon glyphicon-remove"></span>
                  </button>
                </span>
              </div>
              <div className="options space"></div>
            </div>
          ]))
        }
        <button className="btn btn-xs btn-default pull-right" onClick={this.createOption}> Add </button>
      </div>
    );
  }

  render() {
    const { formdata } = this.state;
    return (
      <div className="column">
        <div className="ui form">
          <div className="field">
            <h3>
              {formdata.displayname}
            </h3>
          </div>
          <div className="form-group">
            <label htmlFor="label">Label Text</label>
            <input
              className="form-control"
              type="text" name="label" placeholder="Label"
              value={formdata.label}
              onChange={(e) => { this.handleChange(e.target.value, 'label'); }}
            />
          </div>
          {
            formdata.tagname !== 'SelectBox' ?
              <div className="form-group">
                <label htmlFor="placeholder">Placeholder Text</label>
                <input
                  className="form-control"
                  type="text" name="placeholder" placeholder="placeholder"
                  value={formdata.placeholder}
                  onChange={(e) => { this.handleChange(e.target.value, 'placeholder'); }}
                />
              </div>
            : null
          }
          <div className="form-group">
            <label htmlFor="defaultValue">Default value</label>
            <input
              className="form-control"
              type="text" name="defaultValue"
              value={formdata.defaultValue}
              onChange={(e) => { this.handleChange(e.target.value, 'defaultValue'); }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="placeholder">
              <input
                type="checkbox" name="isRequired"
                checked={formdata.isRequired}
                onChange={(e) => { this.handleChange(e.target.checked, 'isRequired'); }}
              />
              &nbsp;&nbsp;Is Mendatory?
            </label>
          </div>
          {
            formdata.tagname === 'Number' ?
              <div className="form-group">
                <label htmlFor="allowdecimal">
                  <input
                    type="checkbox" name="allowdecimal"
                    checked={formdata.allowdecimal}
                    onChange={(e) => { this.handleChange(e.target.checked, 'allowdecimal'); }}
                  />
                &nbsp;&nbsp;Allow Decimal</label>
              </div>
            : null
          }
          {
            formdata.tagname === 'SelectBox' ?
              this.renderOptionsBox()
            : null
          }
        </div>
      </div>
    );
  }
}

module.exports = PropBoxComponent;
