import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      cells: [],
      cellsPerRow: 40,
      intervalId: 0,
      numberOfRows: 40,
    }
    
    this.buildGrid = this.buildGrid.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
  }
  
  componentDidMount() {
    const intervalId = setInterval(this.updateGrid, 480);
    
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
    
    this.buildGrid();
  }
  
  buildGrid() {
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
    let grid = [];
    let cells = this.state.cells;
    
    
    for(let i = 0; i < this.state.numberOfRows; i++) {
      grid.push([]);        
      for(let j = 0; j < this.state.cellsPerRow; j++) {
        let left = cells[i][j - 1] ? cells[i][j - 1].state : 0;
        let right = cells[i][j + 1] ? cells[i][j + 1].state : 0;
        let up;
        let down;
        
        if( cells[i + 1] ) {
          up = cells[i + 1][j] ? cells[i + 1][j].state : 0; 
        }
        
        if( cells[i - 1] ) {
          down = cells[i - 1][j] ? cells[i - 1][j].state : 0;
        }
        
        let self = cells[i][j];
        
        if( self.state ) {
          grid[i].push( self );
        } else if( left || right || up || down ) {
          let rand = Math.random();
          
          if( rand > 0.5 ) {
            grid[i].push({ key: i.toString() + '-' + j.toString(), state: 1 });
          } else {
            grid[i].push( self );
          }
        } else {
          grid[i].push({ key: i.toString() + '-' + j.toString(), state: 0 });
        }
      }
    }
    
    this.setState({ cells: grid });
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
  
  render() {
    return (
      <div className='container'>
        <div className='grid'>
            <Grid rows={this.state.cells} handleClick={this.handleClick} />
            {this.state.count}
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