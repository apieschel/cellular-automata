import React, { Component } from 'react';
import './App.css';

const KICK = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_bassdrum.wav?1551990664247');
const SNARE = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_snare.wav?1551990663373');
const HIGHHAT = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_hihat.wav?1551990662668');
const OPENHAT = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_openhat.wav?1551990662961');
const SNARESIDE = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_snare_sidestick.wav?1551990663860');
const CONGA = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_conga.wav?1551990662263');
const CONGAHIGH = new Audio('https://cdn.glitch.com/cc093c8e-9559-4f24-a71e-df60d5b1502c%2FMT52_conga_high.wav?1550690555911');
const AC = new AudioContext();
const NODE = AC.createGain();

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      done: false,
      initialized: false,
      count: 1,
      cells: [],
      cellsPerRow: 25,
      intervalId: 0,
      numberOfRows: 25,
    }
    
    this.buildGrid = this.buildGrid.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this.playSound = this.playSound.bind(this);
  }
  
  componentDidMount() {
    const intervalId = setInterval(this.updateGrid, 120);
    
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
    
    this.buildGrid();
  }
  
  playSound() {
    let instrument = SNARESIDE;
    let quiet = true;
    
    console.log(instrument);
    let count = this.state.count;
    
    if( count === 1 || count === 9 || count === 15 || count === 16 ) {
      quiet = false;
      instrument = KICK;
    }
    
    if( count === 12 ) {
      instrument = HIGHHAT;
    }
    
    if( count === 5 || count === 13 ) {
      quiet = false;
      instrument = SNARE;  
    }
    
    if( count === 10 ) {
      instrument = CONGA;
    }
    
    if( count === 14) {
       instrument = CONGAHIGH;
    }
    
    if( count === 8 ) {
      instrument = OPENHAT;
    }
    
    let clone = instrument.cloneNode(true);
      
    const request = new XMLHttpRequest();
    request.open('GET', instrument.src, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      AC.decodeAudioData(request.response, function(buffer) {
        const gain = AC.createGain();
        const playSound = AC.createBufferSource();
        playSound.buffer = buffer;
        playSound.connect(gain);
        gain.connect(NODE);
        gain.connect(AC.destination);
        
        if( quiet ) {
          gain.gain.setValueAtTime(0.2, AC.currentTime);  
        }
        
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
    let count = this.state.count;
    
    if( this.state.initialized && !this.state.done ) {
      this.playSound(); 
      
      let done = true; 
      
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
            
            done = false;
          } else {
            grid[i].push({ key: i.toString() + '-' + j.toString(), state: 0 });
            done = false;
          }
        }
      }
      
      if( count === 16 ) {
        count = 1;
      } else {
        count++;  
      }
      
      this.setState({ cells: grid, done: done, count: count });
    }
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
        initialized: true,
      },
    );
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