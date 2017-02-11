import React, { PropTypes } from 'react';

export const RenderElement = (props) => {
  const { elementObj, onChange, value } = props;
  let component;

  switch (elementObj.tagname) {
    case 'SelectBox':
      const options = elementObj.options;
      component = (
        <select
          className="form-control"
          placeholder={elementObj.placeholder}
          name={elementObj.name}
          value={value || elementObj.defaultValue}
          onChange={onChange}>
          { options.map((option) => (<option key={option}>{option}</option>)) }
        </select>
      );
      break;
    case 'Text':
      component = (
        <input
          className="form-control"
          placeholder={elementObj.placeholder}
          type="text"
          name={elementObj.name}
          value={value || elementObj.defaultValue}
          onChange={onChange}
        />
      );
      break;
    case 'Email':
      component = (
        <input
          className="form-control"
          placeholder={elementObj.placeholder}
          type="email"
          name={elementObj.name}
          value={value || elementObj.defaultValue}
          onChange={onChange}
        />
      );
      break;
    case 'Number':
      component = (
        <input
          className="form-control"
          placeholder={elementObj.placeholder}
          type="number"
          name={elementObj.name}
          value={value || elementObj.defaultValue}
          onChange={onChange}
        />
      );
      break;
    default:
      component = (<div> Undefined Element </div>);
  }

  return (
    <div className="form-group">
      <label htmlFor="label">{elementObj.label}</label>
      { component }
    </div>
  );
};

RenderElement.propTypes = {
  elementObj: PropTypes.any,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

RenderElement.defaultProps = {
  value: '',
  elementObj: null,
  onChange: () => {}
};
