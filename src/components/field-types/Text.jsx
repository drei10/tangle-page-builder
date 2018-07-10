import React from 'react'

export default class Text extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.label}</p>
        <input
          value={this.props.value}
          placeholder={this.props.label}
          onChange={event => this.props.onChange(event.target.value)}
        />
        <p>{this.props.errorMessage}</p>
      </div>
    )
  }
}
