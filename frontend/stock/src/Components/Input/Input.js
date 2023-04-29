import React, { Component } from 'react'
import "./Input.css"
export default class  extends Component {
  render() {
    return (
      <div className='back'>
        <input className={"input "+this.props.variant+(this.props.error? " error":"")} type={this.props.type} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange} />  
      </div>
    )
  }
}
