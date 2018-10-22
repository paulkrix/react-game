import React from 'react';
import ReactDOM from 'react-dom';

import {Stage, Layer} from 'react-konva';

import Event from './Event.js';
import Square from './World/Square.js';
import World from './World/World.js';

export default class Game extends React.Component {
  constructor( props ) {
    super();
    this.state = {
      world: new World( props.settings.world.rows, props.settings.world.columns ),
      selected: null,
    };
    this.events = [];
    this.run();
    this.pathed = [];
  }
  componentDidMount() {
    document.addEventListener("keydown", (event) => { this.handleKeyPress(event); }, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", (event) => { this.handleKeyPress(event); }, false);
  }
  handleKeyPress( event ) {
    switch( event.key ) {
      case "ArrowUp":
      case "w":
        event.preventDefault();
        this.attemptToMoveDude( this.state.world.mainDude, 0, -1 );
        break;
      case "ArrowDown":
      case "s":
        event.preventDefault();
        this.attemptToMoveDude( this.state.world.mainDude, 0, 1 );
        break;
      case "ArrowRight":
      case "d":
        event.preventDefault();
        this.attemptToMoveDude( this.state.world.mainDude, 1, 0 );
        break;
      case "ArrowLeft":
      case "a":
        event.preventDefault();
        this.attemptToMoveDude( this.state.world.mainDude, -1, 0 );
        break;
      default:
        break;
    }
  }
  attemptToMoveDude( dude, deltaX, deltaY ) {
    let dudeLocation = dude.location;
    var canMove = true;
    var newX = deltaX + dudeLocation.x;
    var newY = deltaY + dudeLocation.y;
    let target = this.state.world.getTile( newX, newY );
    let path = this.state.world._doTheThing( dudeLocation, target );
    dude.setPath( path );
    this.pathed = path;

  }
  handleClick( square ) {
    for( let i = 0; i < this.pathed.length; i++ ) {
      this.pathed[i].square.setPath( false );
    }
    this.pathed = [];
    if( this.state.selected !== null ) {
      // this.setState({
      //   path: this.state.world._doTheThing( this.state.selected, square.props.tile ),
      // });
      let path = this.state.world._doTheThing( this.state.selected, square.props.tile );
      this.state.selected.dude.setPath( path );
      this.pathed = path;
      this.showPath( path );
    }
    if( square.props.tile.dude !== null ) {
      this.setState({
        selected: square.props.tile,
      });
    } else {
      this.setState({
        selected: null,
      });
    }
  }
  addEvent( event ) {
    this.events.push( event );
  }
  run() {
    setInterval( () => { this.tick() }, 15);
  }
  tick() {
    while( this.events.length > 0 ) {
      var event = this.events.pop();
      event.do( this );
    }
    this.addEvent( new Event( (game) => {
      //Only step any other dudes if the main dude has an action
      if( this.state.world.mainDude.step() ) {
        let dudes = this.state.world.dudes;
        for( let i = 0; i < dudes.length; i++ ) {
          let path = this.state.world._doTheThing( dudes[i].location, this.state.world.mainDude.location );
          dudes[i].setPath( path );
          dudes[i].step();
        }
      }

    }));
  }
  showPath( path ) {
    for( let i = 0; i < path.length; i++ ) {
      path[i].square.setPath( true );
    }
  }
  render() {
    const tiles = this.state.world.tiles.map( (tile, index) => {
      let selected = false;
      if( this.state.selected === tile ) {
        selected = true;
      }
      return (
        <Square
          x={tile.x}
          y={tile.y}
          color={tile.getColour()}
          tile={tile}
          settings={this.props.settings.tiles}
          onClick={( square ) => this.handleClick( square )}
          key={index}
          selected={selected}
        />
      );
    });

    // const dudes = this.state.world.dudes.map( ( dude, index ) => {
    //   const tile = dude.location;
    //   const x = 1+ (tile.x+0.5) * this.props.settings.tiles.width;
    //   const y = 1+ (tile.y+0.5) * this.props.settings.tiles.height;
    //   const square = tiles[ tile.x + tile.y * this.state.world.columns ];
    //   return (
    //     <Circle
    //       x={x}
    //       y={y}
    //       width={this.props.settings.tiles.width*0.5}
    //       height={this.props.settings.tiles.height*0.5}
    //       fill={'black'}
    //       onClick={ () => square.props.onClick( square ) }
    //       dude={ dude }
    //       key={index}
    //     />
    //   );
    // });
    return (
        <Stage width={ this.props.settings.world.width+2 } height={ this.props.settings.world.height+2 }>
          <Layer>
            {tiles}
          </Layer>
        </Stage>
    );
  }
}
