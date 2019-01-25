import { flatArray } from './public/utils'

export default class Shape {
  constructor(mid, buffer) {
    this.shapes = [
      () => [
        [
          {x: mid - 1, y: buffer - 2},
          {x: mid, y: buffer - 2}
        ],
        [
          { x: mid , y: buffer - 1},
          { x: mid + 1, y: buffer - 1 }
        ]
      ],
      () => [
        [
          {x: mid, y: buffer - 3}
        ],
        [
          {x: mid, y: buffer - 2}
        ],
        [
          {x: mid, y: buffer - 1},
          {x: mid + 1, y: buffer - 1}
        ]
      ]
    ]
  }
  getRandomShape() {
    let shape = this.shapes[Math.floor(this.shapes.length * Math.random())]()
    let flat = flatArray(shape)
    let len = Math.max.apply(null, 
      [
        flat[flat.length - 1].y - flat[0].y + 1,
        flat[flat.length - 1].x - flat[0].x + 1,
      ].concat(shape.length).concat(shape.map((a) => {
        return a.length
      }))
    )
    shape.matrixLen = len
    return shape
  }
}
