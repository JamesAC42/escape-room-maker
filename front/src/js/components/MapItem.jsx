import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import '../../css/mapitem.scss'
import Rating from './Rating'

class MapItem extends Component {
  render () {
    return (
      <div className='map-item'>
        <div className='map-meta'>
          <div className='map-title'>
            <Link to='/'>Test Title</Link>
          </div>
          <div className='map-author'>Creator: James</div>
          <div className='map-creation-date'>Created on: 3.2.3</div>
          <Rating stars={Math.floor(Math.random() * 6)} />
        </div>
        <div className='map-description'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla earum
          sapiente dignissimos, repudiandae accusantium voluptas sed magnam
          explicabo veritatis architecto corrupti minima repellendus in possimus
          magni ab aliquid nobis? Placeat veniam facere eaque ab repudiandae
          autem, error optio dignissimos. Sed sapiente illo a consequuntur iure
          incidunt dolore ducimus vero delectus?
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae esse quis neque quia odio est voluptates dolorem tenetur quidem corporis.
        </div>
        <div className='map-stats'>
          <div className='map-played'>Played 8 times</div>
          <div className='map-ratings-amt'>3 Ratings</div>
        </div>
      </div>
    )
  }
}

export default MapItem
