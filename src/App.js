import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      cells: [],
      cellsPerRow: 10,
      intervalId: null,
      numberOfRows: 10,
    }
    
    this.buildGrid = this.buildGrid.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    const intervalId = setInterval(this.buildGrid, 120);
    
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
  }
  
  buildGrid() {
    console.log('building grid');
    let grid = [];
    
    for(let i = 0; i < this.state.numberOfRows; i++) {
      grid.push([]);        
      for(let j = 0; j < this.state.cellsPerRow; j++) {
        grid[i].push({ key: i.toString() + '-' + j.toString(), state: 0 });
      }
    }
    
    this.setState({ cells: grid });
    console.log(grid);
  }
  
  updateGrid() {
    
  }
  
  handleClick(id) {
    this.setState({
      cells: this.state.cells.map((row) => {
           return row.map((cell) => {
             if(cell.key === id) {
               return Object.assign({}, cell, {
                 state: !cell.state,
               });
             } else {
               return cell;
             }
           })
      }),
    });
  }

  componentDidMount() {
    this.buildGrid();
  }
  
  render() {
    return (
      <div className='container'>
        <div className='grid'>
            <Grid rows={this.state.cells} handleClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

const Grid = function(props) {
  return (
    props.rows.map((row, i) => <div key={i} className='row'>{ row.map( (cell) => <Cell key={cell.key} state={cell.state} handleClick={props.handleClick} id={cell.key} /> ) }</div>)
  )
}

const Cell = function(props) {
    let cssClass = 'cell';
  
    if(props.state) {
      cssClass = 'cell burning';
    }
    return(
      <div className={cssClass} onClick={ () => props.handleClick(props.id) }></div>
    )
}

export default App;