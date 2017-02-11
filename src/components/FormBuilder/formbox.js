import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import { RenderElement } from './renderelement';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    // eslint-disable-next-line
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

@DropTarget([ItemTypes.CARD, ItemTypes.BOX], cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    // index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    // id: PropTypes.any.isRequired,
    boxdata: PropTypes.object,
    className: PropTypes.string,
    removeBox: PropTypes.func,
    fakeBoxStyle: PropTypes.object,
    showProps: PropTypes.func,
    toggleSize: PropTypes.func
    // moveCard: PropTypes.func.isRequired
  };

  static defaultProps = {
    className: '',
    boxdata: {},
    removeBox: () => {},
    fakeBoxStyle: {},
    toggleSize: () => {},
    showProps: () => {}
  }

  render() {
    const { boxdata, isDragging, connectDragSource, connectDropTarget, removeBox,
      fakeBoxStyle, showProps, toggleSize } = this.props;
    let { className } = this.props;
    const opacity = isDragging ? 0 : 1;

    if (boxdata.small) {
      className += ' col-md-6';
    }

    return connectDragSource(connectDropTarget(
      <div
        onClick={showProps}
        style={{ opacity, ...fakeBoxStyle }} className={`element box ${className}`}>
        <RenderElement elementObj={boxdata} />
        <div className="btn-toolbar">
          <div className="element actions btn-group pull-right">
            <button
              className="btn btn-default btn-sm"
              title="Resize"
              onClick={toggleSize}>
              <i className={`fa fa-${boxdata.small ? 'arrows-h' : 'columns'} fa-lg`}></i>
            </button>
            <button
              className="btn btn-default btn-sm"
              title="Change Property"
              onClick={showProps}>
              <i className="fa fa-edit fa-lg"></i>
            </button>
            <button
              className="btn btn-default btn-sm"
              title="Remove Element"
              onClick={removeBox}>
              <i className="fa fa-remove fa-lg"></i>
            </button>
          </div>
        </div>
      </div>
    ));
  }
}
