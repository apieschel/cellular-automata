import React, { Component } from 'react';
import './App.css';

/*
const KICK = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_bassdrum.wav?1551990664247');
const SNARE = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_snare.wav?1551990663373');
const HIGHHAT = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_hihat.wav?1551990662668');
const OPENHAT = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_openhat.wav?1551990662961');
const SNARESIDE = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_snare_sidestick.wav?1551990663860');
const CONGA = new Audio('https://cdn.glitch.com/17f54245-b142-4cf8-a81b-65e0b36f6b8f%2FMT52_conga.wav?1551990662263');
const CONGAHIGH = new Audio('https://cdn.glitch.com/cc093c8e-9559-4f24-a71e-df60d5b1502c%2FMT52_conga_high.wav?1550690555911');
const AC = new AudioContext();
const NODE = AC.createGain();
*/

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
    this.note = this.note.bind(this);
    this.kick = this.kick.bind(this);
    this.createSineWave = this.createSineWave.bind(this);
    this.createAmplifier = this.createAmplifier.bind(this);
    this.rampDown = this.rampDown.bind(this);
    this.chain = this.chain.bind(this);
  }
  
  componentDidMount() {
    const intervalId = setInterval(this.updateGrid, 120);
    
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
    
    this.buildGrid();
  }
  
  playSound() {
    var audio = new AudioContext();
    let count = this.state.count;
    
    if( count === 1 || count === 9 || count === 15 || count === 16 ) {
      this.kick(audio);
    }
    
    if( count === 3 || count === 4 || count === 5 || count === 7 || count === 11 || count === 15 ) {
      this.note(audio, 440);
    }
    
    if( count === 2 ) {
      this.note(audio, 880);
    }
    
    if( count === 13 ) {
      this.note(audio, 659);
    }
    
    if( count === 16 ) {
      this.note(audio, 523);
    }
  }
  
  buildGrid() {
    let grid = [];
    
    for(let i = 0; i < this.state.numberOfRows; i++) {
      grid.push([]);        
      for(let j = 0; j < this.state.cellsPerRow; j++) {
        grid[i].push({ key: i.toString() + '-' + j.toString(), state: parseInt(0) });
      }
    }
    
    this.setState({ cells: grid });
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
            let newState = self.state;
            let rand = Math.random();

            if( self.state < 3 ) {
              if( rand > 0.5 ) {
                newState++;
              }
              done = false;
            }
            
            grid[i].push({ key: i.toString() + '-' + j.toString(), state: newState });
            
          } else if( left || right || up || down ) {
            let rand = Math.random();

            if( rand > 0.5 ) {
              grid[i].push({ key: i.toString() + '-' + j.toString(), state: parseInt(1) });
            } else {
              grid[i].push( self );
            }
            
            done = false;
          } else {
            grid[i].push({ key: i.toString() + '-' + j.toString(), state: parseInt(0) });
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
                 state: 1,
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
  
  /**
   *** These are Mary Rose Cook's functions, used for creating the sounds: https://github.com/maryrosecook/drum-machine/blob/master/drum-machine.js
  **/
  
  // **note()** plays a note with a pitch of `frequency` for `1` second.
  note(audio, frequency) {
      var duration = 1;

      // Create the basic note as a sine wave.  A sine wave produces a
      // pure tone.  Set it to play for `duration` seconds.
      var sineWave = this.createSineWave(audio, duration);

      // Set the note's frequency to `frequency`.  A greater frequency
      // produces a higher note.
      sineWave.frequency.value = frequency;

      // Web audio works by connecting nodes together in chains.  The
      // output of one node becomes the input to the next.  In this way,
      // sound is created and modified.
      this.chain([

        // `sineWave` outputs a pure tone.
        sineWave,

        // An amplifier reduces the volume of the tone from 20% to 0
        // over the duration of the tone.  This produces an echoey
        // effect.
        this.createAmplifier(audio, 0.2, duration),

        // The amplified output is sent to the browser to be played
        // aloud.
        audio.destination]);
  };

  // **kick()** plays a kick drum sound for `1` second.
  kick(audio) {
      var duration = 2;

      // Create the basic note as a sine wave.  A sine wave produces a
      // pure tone.  Set it to play for `duration` seconds.
      var sineWave = this.createSineWave(audio, duration);

      // Set the initial frequency of the drum at a low `160`.  Reduce
      // it to 0 over the duration of the sound.  This produces that
      // BBBBBBBoooooo..... drop effect.
      this.rampDown(audio, sineWave.frequency, 160, duration);

      // Web audio works by connecting nodes together in chains.  The
      // output of one node becomes the input to the next.  In this way,
      // sound is created and modified.
      this.chain([

        // `sineWave` outputs a pure tone.
        sineWave,

        // An amplifier reduces the volume of the tone from 40% to 0
        // over the duration of the tone.  This produces an echoey
        // effect.
        this.createAmplifier(audio, 0.4, duration),

        // The amplified output is sent to the browser to be played
        // aloud.
        audio.destination]);
  };

  // **createSineWave()** returns a sound node that plays a sine wave
  // for `duration` seconds.
  createSineWave(audio, duration) {

    // Create an oscillating sound wave.
    var oscillator = audio.createOscillator();

    // Make the oscillator a sine wave.  Different types of wave produce
    // different characters of sound.  A sine wave produces a pure tone.
    oscillator.type = "sine";

    // Start the sine wave playing right now.
    oscillator.start(audio.currentTime);

    // Tell the sine wave to stop playing after `duration` seconds have
    // passed.
    oscillator.stop(audio.currentTime + duration);

    // Return the sine wave.
    return oscillator;
  };

  // **rampDown()** takes `value`, sets it to `startValue` and reduces
  // it to almost `0` in `duration` seconds.  `value` might be the
  // volume or frequency of a sound.
  rampDown(audio, value, startValue, duration) {
    value.setValueAtTime(startValue, audio.currentTime);
    value.exponentialRampToValueAtTime(0.01, audio.currentTime + duration);
  };

  // **createAmplifier()** returns a sound node that controls the volume
  // of the sound entering it.  The volume is started at `startValue`
  // and ramped down in `duration` seconds to almost `0`.
  createAmplifier(audio, startValue, duration) {
    var amplifier = audio.createGain();
    this.rampDown(audio, amplifier.gain, startValue, duration);
    return amplifier;
  };
  
  // **chain()** connects an array of `soundNodes` into a chain.  If
  // there are three nodes in `soundNodes`, the output of the first will
  // be the input to the second, and the output of the second will be
  // the input to the third.
  chain(soundNodes) {
    for (var i = 0; i < soundNodes.length - 1; i++) {
      soundNodes[i].connect(soundNodes[i + 1]);
    }
  };
  
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
  
    if(props.state === 1) {
      cssClass = 'cell burning';
    }
  
    if(props.state === 2) {
      cssClass = 'cell charred';
    }
  
    if(props.state === 3) {
      cssClass = 'cell gone';
    }
  
    return(
      <div className={cssClass} onClick={ () => props.handleClick(props.id) }></div>
    )
}

export default App;