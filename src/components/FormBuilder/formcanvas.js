import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import update from 'react/lib/update';
import _ from 'lodash';
import ItemTypes from './ItemTypes';
import FormBox from './formbox';
import PropertyBox from './propertybox';

const boxTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
};

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class FormCanvas extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    formState: PropTypes.array,
    selectedElementId: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
    onUpdate: PropTypes.func,
    onRemove: PropTypes.func,
    onPropBox: PropTypes.func.isRequired,
  };

  static defaultProps = {
    formState: [],
    onUpdate: () => {},
    onRemove: () => {}
  }

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.removeBox = this.removeBox.bind(this);
    this.handlePropBox = this.handlePropBox.bind(this);
    this.handlePropUpdate = this.handlePropUpdate.bind(this);
    this.toggleSize = this.toggleSize.bind(this);
    this.closePropBox = this.closePropBox.bind(this);
    const currentindex = _.findIndex(this.props.formState, { id: this.props.selectedElementId });
    this.state = {
      cards: this.props.formState,
      currentCard: this.props.formState[currentindex]
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.formState) {
      this.setState({
        cards: newProps.formState
      });
    }
    if (this.props.selectedElementId !== newProps.selectedElementId) {
      const currentindex = _.findIndex(this.state.cards, { id: newProps.selectedElementId });
      this.setState({
        currentCard: newProps.formState[currentindex]
      });
    }
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
    this.props.onUpdate([...this.state.cards]);
  }

  removeBox(index) {
    this.props.onRemove(index);
  }

  closePropBox() {
    this.props.onPropBox(false);
  }

  handlePropBox(index) {
    const { cards } = this.state;
    const propsCard = cards[index];
    this.props.onPropBox(propsCard.id);
  }

  toggleSize(index) {
    const cards = [...this.state.cards];
    cards[index].small = !cards[index].small;
    this.setState({ cards }, () => {
      this.props.onUpdate([...this.state.cards]);
    });
  }

  handlePropUpdate(card) {
    const cards = [...this.state.cards];
    const currentCardIndex = _.findIndex(cards, { id: card.id });
    cards[currentCardIndex] = card;
    this.setState({ cards }, () => {
      this.props.onUpdate([...this.state.cards]);
    });
  }

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const { cards } = this.state;
    const isActive = canDrop && isOver;

    let fakingStyle = { display: 'none', opacity: 0 };

    let backgroundColor = '#fbfbfb';
    if (isActive) {
      backgroundColor = '#d5d5d5';
      fakingStyle = { display: 'block', opacity: 0 };
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    return connectDropTarget(
      <div>
        <div style={{ backgroundColor }} className="canvas main">
          <div style={{ marginBottom: '15px' }}> { isActive ? 'Release to drop' : null } </div>
          <div className="row">
            <div className="col-md-12">
              {cards.map((card, i) => (
                card.id === -1 ?
                (
                  <FormBox
                    key={card.id}
                    index={i}
                    id={card.id}
                    boxdata={card}
                    fakeBoxStyle={fakingStyle}
                    showProps={() => { this.handlePropBox(i); }}
                    removeBox={() => { this.removeBox(i); }}
                    moveCard={this.moveCard} />
                )
                : (
                  <span key={card.id}>
                    <FormBox
                      index={i}
                      className={this.state.currentCard && card.id === this.state.currentCard.id ? 'active' : ''}
                      id={card.id}
                      boxdata={card}
                      showProps={() => { this.handlePropBox(i); }}
                      removeBox={() => { this.removeBox(i); }}
                      toggleSize={() => { this.toggleSize(i); }}
                      moveCard={this.moveCard} />
                    { cards[i + 1] && !cards[i + 1].small ?
                      <div className="clearfix" /> : null
                    }
                  </span>
                  )
                )
              )}
            </div>
          </div>
        </div>
        {
          this.state.currentCard ?
            <div className="propertybox main">
              <PropertyBox
                closePropBox={this.closePropBox}
                element={this.state.currentCard} onPropertyChage={this.handlePropUpdate} />
            </div>
          : null
        }
      </div>
    );
  }
}
