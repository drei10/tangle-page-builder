import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import validate from './validate';

const renderField = ({ input, label, type, wrapperClass, options, meta: { touched, error } }) => {
  if (type === 'select') {
    return(
      <div className={wrapperClass}>
        <select {...input}>
          {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
        {touched && error && <span>{error}</span>}
      </div>
    )
  } else {
    return(
      <div className={wrapperClass}>
        {type === "textarea" ? <textarea {...input} placeholder={label} /> : <input {...input} type={type} placeholder={label} />}
        {touched && error && <span>{error}</span>}
      </div>
    )
  }
};

const renderFieldAsColumn = ({ input, label, type, columns, meta: { touched, error } }) => (
  <div className={`column column--${columns}`}>
    <textarea
      {...input}
      text={input.value}
      options={{toolbar: {buttons: ['bold', 'italic', 'underline']}}}
    />
    {touched && error && <span>{error}</span>}
  </div>
);

class RenderColumns extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      grid: "1"
    }
    if (props.fields.length === 0) this.addFields(1);
  }

  componentWillReceiveProps(nextProps) {
    const { grid } = this.props;
    if (grid !== nextProps.grid) {
      this.updateFields(nextProps.grid, grid);
    }
  }

  updateFields(newVal, oldVal) {
    const diff = Math.abs(newVal - oldVal);
    if (newVal > oldVal) {
      this.addFields(diff);
    } else {
      this.removeFields(diff);
    }
  }

  removeFields(count) {
    const { fields } = this.props;
    for(let i = 0; i < count; i++) {
      fields.pop()
    }
  }

  addFields(count) {
    const { fields } = this.props;
    for(let i = 0; i < count; i++) {
      fields.push()
    }
  }

  render() {
    const { fields } = this.props;
    const columnList = fields.map((column, index) => (
      <Field
        key={index}
        name={`${column}.text`}
        type="textarea"
        columns={fields.length}
        component={renderFieldAsColumn}
      />
    ))
    return columnList;
  }

}

class RenderRows extends React.Component {

  constructor(props) {
    super(props);
    if (props.fields.length === 0) this.addRow();
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      grid: value
    }, function() {
      console.log('state', this.state);
    })
  }

  addRow() {
    const { fields } = this.props;
    fields.push({grid: "1"});
  }

  render() {
    const { fields, meta: { error } } = this.props;
    return(
      <div className="container">
        <ul>
          <button
            type="button"
            name={this.props.fields.name}
            className="hidden"
            onClick={this.addRow.bind(this)}
          />
          {fields.map((row, index) => (
            <li key={index} className="row">
              <div className="toolbar">
                <Field
                  name={`${row}.grid`}
                  type="select"
                  options={[1,2,3]}
                  onChange={this.handleChange.bind(this)}
                  component={renderField}
                />
                <button
                  type="button"
                  className="tool tool--delete"
                  onClick={() => fields.remove(index)}
                />
              </div>
              <FieldArray name={`${row}.columns`} grid={fields.get(index).grid} component={RenderColumns} />
            </li>
          ))}
          {error && <li className="error">{error}</li>}
        </ul>
      </div>
    )
  }

};

const clickOnHiddenButton = (name) => {
  const element = document.getElementsByName(name)[0];
  element.click();
}

const handleColorChange = (event) => {
  const element = event.target;
  const value = element.value;
  console.log('value', value);
  const toolbar = element.closest('.toolbar');
  toolbar.style.backgroundColor = value;
}

const renderSections = ({ fields, meta: { touched, error, submitFailed } }) => (
  <div className="section-container">
    <ul>
      {fields.map((section, index) => (
        <li key={index} className="section">
          <div className="toolbar">
            <div className="left">

            </div>
            <div className="right">
              <button
                type="button"
                className="button btn-dark"
                onClick={() => clickOnHiddenButton(`${section}.rows`)}>
                Add Row
              </button>
              <Field
                name={`${section}.color`}
                type="color"
                onChange={handleColorChange}
                component={renderField}
                label="Section color"
              />
              <button
                type="button"
                className="tool tool--delete"
                onClick={() => fields.remove(index)}
              />
            </div>
          </div>
          <FieldArray name={`${section}.rows`} component={RenderRows} />
        </li>
      ))}
      <li>
        <button type="button" className="button btn-dark" onClick={() => fields.push({})}>Add Section</button>
        {(touched || submitFailed) && error && <span>{error}</span>}
      </li>
    </ul>
  </div>
);

const Form = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </button>
      </div>
      <Field
        name="pageTitle"
        type="text"
        component={renderField}
        label="Page Title"
      />
      <FieldArray name="sections" component={renderSections} />
    </form>
  );
};

export default reduxForm({
  form: 'form', // a unique identifier for this form
  validate
})(Form);
