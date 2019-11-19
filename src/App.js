import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      cells: [],
      cellsPerRow: 10,
      numberOfRows: 10,
    }
    
    this.buildGrid = this.buildGrid.bind(this);
  }
  
  buildGrid() {
    let grid = [];
    
    for(let i = 0; i < this.state.numberOfRows; i++) {
      grid.push([]);        
      for(let j = 0; j < this.state.cellsPerRow; j++) {
        grid[i].push({ key: i.toString() + '-' + j.toString() });
      }
    }
    
    this.setState({ cells: grid });
  }

  componentDidMount() {
    this.buildGrid();
  }
  
  render() {
    
    return (
      <div className='container'>
        <div className='grid'>
            <Grid rows={this.state.cells} />
        </div>
      </div>
    );
  }
}

const Grid = function(props) {
  return (
    props.rows.map((row, i) => <div key={i} className='row'>{ row.map( (cell) => <Cell key={cell.key}/> ) }</div>)
  )
}

const Cell = function(props) { 
    return(
      <div className='cell'></div>
    )
}

export default App;