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
            {this.state.cells.map((row,i)=><div key={i} className='row'>{row.map((cell)=><div key={cell.key} className='cell'></div>)}</div>)}
        </div>
      </div>
    );
  }
}

export default App;
