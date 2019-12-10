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
    this.handleClick = this.handleClick.bind(this);
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
  
  handleClick(id) {
    console.log(id);
    this.setState({
      cells: this.state.cells.map((row) => {
         if(row) {
           row.map((cell) => {
             console.log(cell);
             if(cell.key === id) {
               return Object.assign({}, cell, {
                 state: 1,
               });
             } else {
               return cell;
             }
           })
         }
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