type uuid = string;
type timestamp = number;

export interface IRoomGraph {

  startRoom: uuid,
  endRoom: uuid,
  currentRoom: uuid,

  graph: {
    [roomid:string]: IRoom
  },

  coordinates: {
    [roomid:string]: ICoordinates
  }

}

interface ICoordinates {

  x: number,
  y: number

}

enum Direction {

  NORTH,
  SOUTH,
  EAST,
  WEST

}

export interface IRoom {

  uid: uuid,
  event: IRoomEvent,
  visited: boolean,
  start: boolean,
  end: boolean,
  coordinates: ICoordinates,
  doors: {
    [dir in Direction]: IDoor
  }

}

export interface IDoor {

  uid: uuid,
  rooms: Array<uuid>,
  locked: boolean,
  events: {
    [sourceRoom:string]: IDoorEvent
  }

}

interface IEvent {

  sourceRoom: uuid,
  pageData: string, // TODO: type this
  completed: boolean,
  description: string

}

enum Tiles {

}

export interface IRoomEvent extends IEvent {

  image: string,
  tile: Tiles

}

export interface IItemRoomEvent extends IRoomEvent {

  items: Array<IItem>

}

export interface IDoorEvent extends IEvent {

  door: uuid,
  destRoom: uuid

}

export interface IItem {

  name: string,
  uid: uuid,
  room: uuid,
  image: string

}

export interface IPlayer {

  name: string,
  inventory: Array<IItem>,
  currentRoom: uuid,
  image: string

}

export interface IRating {

  author: uuid,
  timestamp: timestamp,
  map: uuid,
  header: string,
  text: string,
  rating: 1 | 2 | 3 | 4 | 5

}

export interface IMap {

  uid: uuid,
  creator: uuid,
  createdOn: timestamp,
  lastModified: timestamp,
  ratings: Array<IRating>,
  timeLimit: number,
  tags: Array<string>,
  description: string,
  title: string,
  explicit: boolean,
  timesCompleted: number,
  graph: IRoomGraph

}
