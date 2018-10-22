import React from 'react';
import ReactDOM from 'react-dom';
import {Layer, Rect, Circle, Stage, Group} from 'react-konva';

export default class Square extends React.Component {
  constructor(props) {
    super();
    props.tile.setSquare( this );
    this.state = {
      fill: 'transparent',
      data: props.data,
      onPath: false,
      dude: props.tile.dude,
    };
  }
  setPath( value ) {
    this.setState({
      onPath: value,
    })
  }
  setDude( dude ) {
    this.setState({
      dude: dude,
    })
  }
  render() {
    const x = 1 + this.props.x * this.props.settings.width;
    const y = 1 + this.props.y * this.props.settings.height;
    let path = null;
    if( this.state.onPath ) {
      path = <Rect
        x={x+1}
        y={y+1}
        width={this.props.settings.width-2}
        height={this.props.settings.height-2}
        fill={'rgba(255,0,0,0.5)'}
        onClick={() => this.props.onClick(this)}
      />
    }
    let focus = null;
    if( this.props.selected ) {
      focus = <Rect
        x={x+1}
        y={y+1}
        width={this.props.settings.width-2}
        height={this.props.settings.height-2}
        fill={this.props.color}
        stroke={'blue'} strokeWidth={1}
        onClick={() => this.props.onClick(this)}
      />
    }
    let dude = null;
    if( this.state.dude !== null ) {
      const cx = x + 0.5 * this.props.settings.width;
      const cy = y + 0.5 * this.props.settings.height;
      dude = <Circle
        x={cx}
        y={cy}
        width={this.props.settings.width*0.5}
        height={this.props.settings.height*0.5}
        fill={'black'}
        onClick={ () => this.props.onClick( this ) }
        dude={ this.state.dude }
      />
    }
    return (
      <Group>
        <Rect
          x={x} y={y} width={this.props.settings.width} height={this.props.settings.height}
          stroke={'rgba(255,255,255,0.2)'} strokeWidth={1}
          fill={this.props.color}
          onClick={() => this.props.onClick(this)}
        />
        {focus}
        {path}
        {dude}
      </Group>
    );
  }
}
