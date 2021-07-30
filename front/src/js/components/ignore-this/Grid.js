import React, { Component } from 'react'
export default class Grid extends Component {
  render () {
    const row = []
    for (let i = 0; i < this.props.size; i++) {
      row.push(<div className='grid-item' key={i} />)
    }
    const grid = []
    for (let i = 0; i < this.props.size; i++) {
      grid.push([...row])
    }
    return (
      <div
        className='grid'
        onClick={(e) => this.props.selectSize(this.props.s)}
      >
        {
                    grid.map((row, i) =>
                      <div
                        className='grid-row flex-row'
                        key={i}
                      >
                        {row}
                      </div>)
                }
      </div>
    )
  }
}
