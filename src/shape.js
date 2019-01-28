export default class Shape {
  constructor(mid, buffer) {
    this.shapes = [
      // () => [
      //   [
      //     {x: mid - 1, y: buffer - 2},
      //     {x: mid, y: buffer - 2},
      //     null
      //   ],
      //   [
      //     null,
      //     { x: mid , y: buffer - 1},
      //     { x: mid + 1, y: buffer - 1 }
      //   ],
      //   [null, null, null]
      // ],
      () => [
        [
          {x: mid, y: buffer - 3},
          null,
          null
        ],
        [
          {x: mid, y: buffer - 2},
          null,
          null
        ],
        [
          {x: mid, y: buffer - 1},
          {x: mid + 1, y: buffer - 1},
          null
        ]
      ]
    ]
  }
  getRandomShape() {
    return this.shapes[Math.floor(this.shapes.length * Math.random())]()
  }
}