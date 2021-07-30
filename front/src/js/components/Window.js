import React, { Component } from 'react'
import '../../css/Window.scss'

class Window extends Component {
  render () {
    const headText = this.props.headText
    // maybe have text and images and stuff?
    // maybe have a way to change which?
    return (
      <div className='window' />
    )
  }
}

export default Window
