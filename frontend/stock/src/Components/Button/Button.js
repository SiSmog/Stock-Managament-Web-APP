import React, { Component } from 'react'
import './Button.css'
export default class Button extends Component {

  
  render() {
    return (
      <button className={this.props.variant+" "+this.props.size} onClick={this.props.onClick}>{this.props.text}</button>
    )
  }
}
