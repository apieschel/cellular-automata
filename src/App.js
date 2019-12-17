import React, { Component } from 'react';
import './App.css';

const KICK = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_bassdrum.wav?1551990664247');
const AC = new AudioContext();
const NODE = AC.createGain();

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      audio: false,
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
    const intervalId = setInterval(this.updateGrid, 120);
    
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
    
    this.buildGrid();
  }
  
  playSound() {
    let clone = KICK.cloneNode(true);
    let buffer;
      
    const request = new XMLHttpRequest();
    request.open('GET', KICK.src, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      AC.decodeAudioData(request.response, function(buffer) {
        const gain = AC.createGain();
        const playSound = AC.createBufferSource();
        playSound.buffer = buffer;
        playSound.connect(gain);
        gain.connect(NODE);
        gain.connect(AC.destination);
        playSound.start(0);

        clone.remove();
      });     
    }
      
      request.send();
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
    
    if(this.state.audio) {
      KICK.play();
    } 
    
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
        audio: true,
      },
    );
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