// Define some custom types
type uuid = string;
type timestamp = number;

// The Map stores all meta information
// about a map, as well as the graph
export interface IMap {
  uid: uuid;
  creator: uuid;
  createdOn: timestamp;
  lastModified: timestamp;
  ratings: Array<IReview>;
  timeLimit: number;
  tags: Array<string>;
  description: string;
  title: string;
  explicit: boolean;
  timesCompleted: number;
  graph: IRoomGraph;
}

// The room graph stores the grid of rooms 
// and their data and coordinates
export interface IRoomGraph {
  startRoom: uuid;
  endRoom: uuid;
  currentRoom: uuid;

  graph: {
    [roomid: string]: IRoom;
  };

  coordinates: {
    [roomid: string]: ICoordinates;
  };
}

// Stores location of a room
interface ICoordinates {
  x: number;
  y: number;
}

enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

// Data stored in a room
export interface IRoom {
  uid: uuid;
  event: IRoomEvent;
  visited: boolean;
  start: boolean;
  end: boolean;
  coordinates: ICoordinates;
  doors: {
    [dir in Direction]: IDoor;
  };
}

// Data stored in a door
export interface IDoor {
  uid: uuid;
  rooms: Array<uuid>;
  locked: boolean;
  events: {
    [sourceRoom: string]: IDoorEvent;
  };
}

// Event information
interface IEvent {
  sourceRoom: uuid;
  pageData: string;
  completed: boolean;
  description: string;
}

// Possible Tile types, or images that would be displayed
// on a Room grid cell
enum Tiles {}

// Events for rooms have extra information
export interface IRoomEvent extends IEvent {
  image: string;
  tile: Tiles;
}

// Rooms with items store the items they contain
export interface IItemRoomEvent extends IRoomEvent {
  items: Array<IItem>;
}

// Door events have extra information compared to normal
// Events
export interface IDoorEvent extends IEvent {
  door: uuid;
  destRoom: uuid;
}

// Data stored in an item
export interface IItem {
  name: string;
  uid: uuid;
  room: uuid;
  image: string;
}

// Data associated with a player
export interface IPlayer {
  name: string;
  inventory: Array<IItem>;
  currentRoom: uuid;
  image: string;
}

// A rating on a map
export interface IReview {
  uid:uuid;
  author: uuid;
  timestamp: timestamp;
  map: uuid;
  title: string;
  body: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

// Rating information stored in the table
export interface IReviewDB {
  uid:uuid,
  mapId:uuid, 
  userId:uuid,
  timestamp:Date,
  rating: 1 | 2 | 3 | 4 | 5,
  title:string,
  body:string
}