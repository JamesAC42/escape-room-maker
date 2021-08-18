// Represents a map card
export class Map {
  constructor() {
    this.title = "";
    this.description = "";
    this.timeLimit = Infinity;
    this.tags = [];
    this.explicit = false;
  }
}

// Represents the data structure containing the rooms of the graph
export class Graph {
  constructor() {
    this.startRoom = null;
    this.endRoom = null;
    this.currentRoom = null;
    this.graph = {};
    this.coordinates = {};
  }
}

// Represents the data structure containing the events in each room
export class Room {
  constructor(uid, coordinates) {
    this.uid = uid;
    this.event = null;
    this.visited = false;
    this.start = false;
    this.end = false;
    this.coordinates = coordinates;
    this.doorVals = ["N", "S", "W", "E"].map((dir) => new Door(uid, dir));
    this.eventType = "No Event";
    this.requireItem = false;
    this.requireItemName = "";
    this.eventQ = "";
    this.eventA = "";
    this.solveItem = false;
    this.solveItemName = "";
    this.solveItemDesc = "";
  }
}

export class Door {
  constructor(uid, dir) {
    this.dir = dir;
    this.room = uid;
    this.eventType = "No Event";
    this.requireItem = false;
    this.requireItemName = "";
    this.eventQ = "";
    this.eventA = "";
    this.solveItem = false;
    this.solveItemName = "";
    this.solveItemDesc = "";
  }
}

// Stores x and y coordinates
export class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
