const dummyGraph = {
  startRoom: "a",
  endRoom: "e",
  currentRoom: "d",

  graph: {
    a: {
      uid: "a",
      event: {
        image: "none",
        tile: 0,
      },
      visited: true,
      start: true,
      end: false,
      coordinates: {
        x: 0,
        y: 0,
      },
      doors: {
        NORTH: {
          uid: "door_a",
          rooms: ["a", "b"],
          locked: false,
        },
      },
    },
    b: {
      uid: "a",
      event: {
        image: "none",
        tile: 0,
      },
      visited: true,
      start: true,
      end: false,
      coordinates: {
        x: 0,
        y: 0,
      },
      doors: {
        NORTH: {
          uid: "door_a",
          rooms: ["a", "b"],
          locked: false,
        },
      },
    },
    c: {
      uid: "a",
      event: {
        image: "none",
        tile: 0,
      },
      visited: true,
      start: true,
      end: false,
      coordinates: {
        x: 0,
        y: 0,
      },
      doors: {
        NORTH: {
          uid: "door_a",
          rooms: ["a", "b"],
          locked: false,
        },
      },
    },
    d: {
      uid: "a",
      event: {
        image: "none",
        tile: 0,
      },
      visited: true,
      start: true,
      end: false,
      coordinates: {
        x: 0,
        y: 0,
      },
      doors: {
        NORTH: {
          uid: "door_a",
          rooms: ["a", "b"],
          locked: false,
        },
      },
    },
    e: {
      uid: "a",
      event: {
        image: "none",
        tile: 0,
      },
      visited: true,
      start: true,
      end: false,
      coordinates: {
        x: 0,
        y: 0,
      },
      doors: {
        NORTH: {
          uid: "door_a",
          rooms: ["a", "b"],
          locked: false,
        },
      },
    },
  },

  coordinates: {
    a: {
      x: 0,
      y: 0,
    },
    b: {
      x: 0,
      y: 1,
    },
    c: {
      x: 1,
      y: 0,
    },
    d: {
      x: 2,
      y: 0,
    },
    e: {
      x: 2,
      y: 1,
    },
    f: {
      x: -1,
      y: 0,
    },
    g: {
      x: -1,
      y: 1,
    },
    h: {
      x: -1,
      y: -1,
    },
    i: {
      x: -2,
      y: 1,
    },
    j: {
      x: -1,
      y: -2,
    },
    k: {
      x: -1,
      y: -3,
    },
    l: {
      x: -2,
      y: 2,
    },
    m: {
      x: 0,
      y: -2,
    },
    n: {
      x: 2,
      y: -1,
    },
  },
};

export default dummyGraph;
