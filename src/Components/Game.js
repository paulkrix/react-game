import React from 'react';
import ReactDOM from 'react-dom';

import {Layer, Rect, Circle, Stage, Group} from 'react-konva';

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
      let dudes = this.state.world.dudes;
      for( let i = 0; i < dudes.length; i++ ) {
        dudes[i].step();
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
