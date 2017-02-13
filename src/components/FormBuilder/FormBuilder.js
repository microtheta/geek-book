import React, { Component } from 'react';
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
export default class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formState: [fakeElement]
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleRemove(index) {
    this.setState(update(this.state, {
      formState: {
        $splice: [
          [index, 1]
        ]
      }
    }));
  }

  handleUpdate(newList) {
    this.setState({ formState: newList });
  }

  handleDrop(item) {
    const { name } = item;
    const dropIndex = _.findIndex(this.state.formState, { id: -1 });
    const newElement = { ...formElements[name], id: new Date().valueOf() + Math.random() };
    this.setState(update(this.state, {
      formState: {
        $splice: [
          [dropIndex, 1, newElement]
        ],
        $push: [
          fakeElement
        ]
      }
    }));
    this.setState({ selectedElement: newElement.id });
  }

  render() {
    const elementList = [];
    Object.keys(formElements).forEach((key) => {
      elementList.push(
        <Box key={key} name={key} fakeIndex={_.findIndex(this.state.formState, { id: -1 })} />
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
              formState={this.state.formState}
              selectedElementId={this.state.selectedElement}
              />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12">
            <pre> {JSON.stringify(this.state.formState, null, 4)} </pre>
          </div>
        </div>
      </div>
    );
  }
}
