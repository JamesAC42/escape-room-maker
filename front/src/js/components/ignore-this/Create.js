import React, { Component } from 'react';
import '../../css/Create.scss';
import GridSmall from './GridSmall';
import Grid from './Grid';

class Create extends Component {
    constructor(props){
        super(props);
        this.state = {
            sizeSelected: false,
            size: undefined,
            grid: []
        }
    }
    selectSize(s) {
        this.setState({
            sizeSelected:true,
            size: s
        });
    }
    generateGrid() {
        let grid = [];
        for(let i = 0; i < this.state.size; i++) {
            let row = [];
            for(let j = 0; j < this.state.size; j++) {
                row.push({
                    coord: [i, j],
                    questions: []
                })
            }
            grid.push(row);
        }
    }
    render() {
        const sizes = [1,2,3,5];
        if(!this.state.sizeSelected) {
            return(
                <div className="full-outer center-child">
                    <div className="select-grid-size-outer flex-col flex-stretch">
                        <div className="select-grid-size-title">
                            Select a grid size
                        </div>
                        <div className="grid-dimensions-outer flex-row flex-center">
                            {
                                sizes.map((s, i) => <GridSmall
                                    key={i}
                                    size={s}
                                    selectSize={(s) => this.selectSize(s)}/>)
                            }
                        </div>
                    </div>
                </div>
            )
        } else {
            return(
                <div className="full-outer flex-row">
                    <div className="grid-display"></div>
                </div>
            )
        }
    }
}

export default Create;