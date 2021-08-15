import React, {Component} from 'react';

class TagState {
    constructor() {
        this.pressed = false;
    }
}

class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = new TagState();
    }
    render() {
        let className = "tag-link";
        if(this.props.active) className += " tag-link-active";
        if(this.state.pressed) className += " tag-link-pressed";
        return(
            <div 
                className={className}
                onClick={() => this.props.onClick()}
                onMouseDown={() => this.setState({pressed:true})}
                onMouseUp={() => this.setState({pressed:false})}>
                {this.props.name}
            </div>
        )
    }
}

export default Tag;