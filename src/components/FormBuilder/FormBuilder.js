import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import update from 'react/lib/update';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import './formbuilder.css';
import FormCanvas from './formcanvas';
import Box from './box';

const fakeElement = {
  displayname: '',
  tagname: '',
  label: '',
  placeholder: '',
  defaultValue: '',
  isRequired: false,
  id: -1
};

const formElements = {
  Text: {
    displayname: 'Text Input',
    tagname: 'Text',
    label: 'Text input',
    placeholder: 'Text Input box ',
    defaultValue: '',
    isRequired: false,
    small: false
  },
  Email: {
    displayname: 'Email input',
    tagname: 'Email',
    label: 'Email input',
    placeholder: 'Email Input box ',
    defaultValue: '',
    isRequired: false,
    small: false
  },
  Number: {
    displayname: 'Number input',
    tagname: 'Number',
    label: 'Number',
    placeholder: 'Enter a number ',
    allowdecimal: true,
    defaultValue: '',
    isRequired: false,
    small: false
  },
  SelectBox: {
    displayname: 'Select box',
    tagname: 'SelectBox',
    label: 'Single item Select',
    placeholder: 'Please select an item',
    defaultValue: '',
    options: [],
    isRequired: false,
    small: false
  }
};

@DragDropContext(HTML5Backend)
export default class ContainerComponent extends Component {

  static propTypes = {
    updateCanvase: PropTypes.func.isRequired,
    selectElement: PropTypes.func.isRequired,
    selectedElement: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
    formState: PropTypes.array
  };

  static defaultProps = {
    formState: [],
  }

  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    const fakeIndex = _.findIndex(this.props.formState, { id: -1 });
    if (fakeIndex === -1) {
      this.props.updateCanvase([fakeElement]);
    }
  }

  handleRemove(index) {
    const updatedState = update(this.props, {
      formState: {
        $splice: [
          [index, 1]
        ]
      }
    });
    if (this.props.formState[index].id === this.props.selectedElement) {
      this.props.selectElement(false);
    }
    this.props.updateCanvase(updatedState.formState);
  }

  handleUpdate(newList) {
    this.props.updateCanvase(newList);
  }

  handleDrop(item) {
    const { name } = item;
    const dropIndex = _.findIndex(this.props.formState, { id: -1 });
    const newElement = { ...formElements[name], id: new Date().valueOf() + Math.random() };
    const updatedState = update(this.props, {
      formState: {
        $splice: [
          [dropIndex, 1, newElement]
        ],
        $push: [
          fakeElement
        ]
      }
    });
    this.props.updateCanvase(updatedState.formState);
    this.props.selectElement(newElement.id);
  }

  render() {
    const elementList = [];
    Object.keys(formElements).forEach((key) => {
      elementList.push(
        <Box
          key={key}
          name={key}
          title={formElements[key].displayname}
          fakeIndex={_.findIndex(this.props.formState, { id: -1 })} />
      );
    });
    return (
      <div>
        <div className="row">
          <div className="col-md-2">
            {elementList}
          </div>
          <div className="col-md-10">
            <FormCanvas
              onDrop={(item) => this.handleDrop(item)}
              onRemove={this.handleRemove}
              onUpdate={(list) => this.handleUpdate(list)}
              onPropBox={this.props.selectElement}
              formState={this.props.formState}
              selectedElementId={this.props.selectedElement}
              />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12">
            <pre> {JSON.stringify(this.props.formState, null, 4)} </pre>
          </div>
        </div>
      </div>
    );
  }
}
