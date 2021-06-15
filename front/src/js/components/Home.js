import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Home.scss';

class Home extends Component {
    render() {
        return(
            <div className="full-outer center-child">
                <div className="welcome flex-col flex-center">
                    <div className="title">Escape Room Maker</div>
                    <div className="create-btn-outer">
                        <Link to="/create">
                            <div className="button button-blue">
                                Create a Room  
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;