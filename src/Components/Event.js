export default class Event {
  constructor( callback ) {
    this.callback = callback;
  }
  do( game ) {
    this.callback( game );
  }
}
