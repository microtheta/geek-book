import _ from 'lodash';
const UPDATECANVAS = 'formbuilder/UPDATECANVAS';
const RESETCANVAS = 'formbuilder/RESETCANVAS';
const SELECTELEMENT = 'formbuilder/SELECTELEMENT';

const initialState = {
  form: [],
  selectedElement: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATECANVAS:
      return {
        ...state,
        form: action.payload
      };

    case RESETCANVAS:
      const fakeIndex = _.findIndex(state.form, { id: -1 });
      const fakeElem = state.form[fakeIndex];
      return {
        ...state,
        form: [fakeElem]
      };

    case SELECTELEMENT:
      return {
        ...state,
        selectedElement: action.payload
      };

    default:
      return state;
  }
}

export function resetCanvase() {
  return {
    type: RESETCANVAS
  };
}

export function updateCanvase(form) {
  return {
    type: UPDATECANVAS,
    payload: form
  };
}

export function setSelectedElement(id) {
  return {
    type: SELECTELEMENT,
    payload: id
  };
}
