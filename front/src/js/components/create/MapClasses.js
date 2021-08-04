export class Map {
  constructor() {
    this.title = "";
    this.description = "";
    this.timeLimit = Infinity;
    this.tags = [];
    this.explicit = false;
  }
}

export class Graph {
  constructor() {
    this.startRoom = null;
    this.endRoom = null;
    this.currentRoom = null;
    this.graph = {};
    this.coordinates = {};
  }
}

export class Room {
  constructor(uid, coordinates) {
    this.uid = uid;
    this.event = null;
    this.visited = false;
    this.start = false;
    this.end = false;
    this.coordinates = coordinates;
    this.doorVals = ["N", "S", "W", "E"].map(dir => new Door(uid, dir));
    this.eventType = "No Event";
    this.requireItem = false;
    this.requireItemName = "req item name - " + uid;
    this.requireQuestion = true;
    this.eventQ = "event question - " + uid;
    this.eventA = "event answer - " + uid;
    this.solveItem = false;
    this.solveItemName = "solve item name - " + uid;
    this.solveItemDesc = "solve item desc - " + uid;
  }
}

export class Door {
  constructor(uid, dir) {
    this.dir = dir;
    this.room = uid;
    this.eventType = "No Event";
    this.requireItem = false;
    this.requireItemName = dir + " - req item name - " + uid;
    this.requireQuestion = true;
    this.eventQ = dir + " - event question - " + uid;
    this.eventA = dir + " - event answer - " + uid;
    this.solveItem = false;
    this.solveItemName = dir + " - solve item name - " + uid;
    this.solveItemDesc = dir + " - solve item desc - " + uid;
  }
}

export class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
