import React, { Component } from 'react'
import {
  BsStarFill,
  BsStar
} from 'react-icons/bs'

import '../../css/rating.scss'

class Rating extends Component {
  render () {
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < this.props.stars) {
        stars.push(<BsStarFill style={{ verticalAlign: 'middle' }} />)
      } else {
        stars.push(<BsStar style={{ verticalAlign: 'middle' }} />)
      }
    }
    return (
      <div className='rating-container'>
        {stars}
      </div>
    )
  }
}

export default Rating
