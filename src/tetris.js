import { flatArray } from './public/utils'

const boxState = {
  filled: 1,
  empty: 0
}
const rowLen = 25
const colLen = 10
const interval = 800
let fullLine = ''

for (let i = 0; i < colLen; ++i) {
  fullLine += boxState.filled
}

export default class Tetris {
  constructor() {
    let arr = []
    for (let i = 0; i < rowLen; ++i) {
      let col = []
      for (let j = 0; j < colLen; ++j) {
        col.push(boxState.empty)
      }
      arr.push(col)
    }
    this.state = arr
    this.timer = null
    this.handlers = {}
    this._activeShape = null
    this.paused = false
    this.stoped = false
  }
  get activeShape() {
    const s = flatArray(this._activeShape)
    return s.length ? s : null
  }
  set activeShape(s) {
    this._activeShape = s
  }
  start() {
    const me = this
    function loop() {
      me.timer = setTimeout(loop, interval)

      if (me.paused || me.stoped) {
        return
      }

      if (me.activeShape) {
        if (!me.canMove('down')) {
          me.checkLines()
          me.addShape()
        } else {
          me.move('down')
        }
      } else {
        me.addShape()
      }
    }
    loop()
  }
  checkLines() {
    this.pause()
    // check full filled line
    let o = {}
    this.activeShape.map((d) => {
      return o[d.y] = 1
    })
    let offset = 0
    let arr = Object.keys(o)
    for (let i = 0, l = arr.length; i < l; ++i) {
      let y = +arr[i] + offset
      if (this.state[y].join('') === fullLine) {
        // remove this line
        this.state.splice(y, 1)
        //the offset of next y
        offset = 1
        // add new line
        let newLine = []
        for (let j = 0; j < colLen; ++j) {
          newLine.push(boxState.empty)
        }
        this.state.unshift(newLine)
      } else {
        offset = 0
      }
    }
    this.emit('state')
    this.resume()
  }
  pause() {
    clearTimeout(this.timer)
    this.paused = true
  }
  resume() {
    this.paused = false
  }
  stop() {
    this.stoped = true
    this.emit('over')
    clearTimeout(this.timer)
  }
  canMove(dir) {
    if (this.paused || this.stoped || !this.activeShape) {
      return false
    }

    if (dir === 'down') {
      let dot = this.activeShape[this.activeShape.length - 1]

      if (dot.y + 1 > rowLen - 1) {
        return false
      }

      let lastRow = this.activeShape.filter((b) => {
        return b.y === dot.y
      })
      for (let i = 0, len = lastRow.length; i < len; ++i) {
        let d = lastRow[i]
        if (this.state[d.y + 1][d.x] === boxState.filled) {
          return false
        }
      }
    } else if (dir === 'left') {
      let dot = this.activeShape[0]

      if (dot.x - 1 < 0) {
        return false
      }

      let leftCol = this.activeShape.filter((b) => {
        return b.x === dot.x
      })
      for (let j = 0; j < leftCol.length; ++j) {
        let d = leftCol[j]
        if (this.state[d.y][d.x - 1] === boxState.filled) {
          return false
        }
      }
    } else if (dir === 'right') {
      let dot = this.activeShape[this.activeShape.length - 1]

      if (dot.x + 1 > colLen - 1) {
        return false
      }

      let rightCol = this.activeShape.filter((b) => {
        return b.x === dot.x
      })
      for (let m = 0; m < rightCol.length; ++m) {
        let d = rightCol[m]
        if (this.state[d.y][d.x + 1] === boxState.filled) {
          return false
        }
      }
    }

    return true
  }
  move(dir) {
    this.cleanShape(this.activeShape)

    if (dir === 'down') {
      for (let j = 0; j < this.activeShape.length; ++j) {
        let dot = this.activeShape[j]
        dot.y += 1
        this.state[dot.y][dot.x] = boxState.filled
      }
    } else if (dir === 'left') {
      for (let m = 0; m < this.activeShape.length; ++m) {
        let dot = this.activeShape[m]
        dot.x -= 1
        this.state[dot.y][dot.x] = boxState.filled
      }
    } else if (dir === 'right') {
      for (let n = 0; n < this.activeShape.length; ++n) {
        let dot = this.activeShape[n]
        dot.x += 1
        this.state[dot.y][dot.x] = boxState.filled
      }
    }

    this.emit('state')
  }
  getNextShape() {
    return [
      [
        {x: 4, y: 3}
      ],
      [
        { x: 4, y: 4 },
        { x: 5, y: 4 }
      ]
    ]
  }
  transformShape() {
    const row = col = Math.max.apply(null, 
      this._activeShape.map((arr) => { 
        return arr.length 
      }).concat(this._activeShape.length))

    // init with null
    let res = []
    for (let i = 0; i < row; ++i) {
      let r = []
      for (let j = 0; j < col; ++j) {
        r.push(null)
      }
      res.push(r)
    }

    for (let m = 0; m < row; ++m) {
      for (let n = 0; n < col; ++n) {
        let p = matrix[m][n]
        if (p) {
          p.x += col - 1 - m - n
          p.y += n - m
          res[n][col - 1 - m] = p
        }
      }
    }

    this.cleanShape(this.activeShape)
    let flatten = flatArray(res)
    if (this.canDrawShape(flatten)) {
      this.activeShape = res
      this.drawShape(flatten)
    } else {
      this.drawShape(this.activeShape)
    }

    this.emit('state')
  }
  cleanShape (s) {
    for (i = 0, len = s.length; i < len; ++i) {
      dot = s[i]
      this.state[dot.y][dot.x] === boxState.empty
    }
  }
  drawShape (s) {
    for (i = 0, len = s.length; i < len; ++i) {
      dot = s[i]
      this.state[dot.y][dot.x] === boxState.filled
    }
  }
  canDrawShape(s) {
    for (i = 0, len = s.length; i < len; ++i) {
      dot = s[i]
      if (this.state[dot.y][dot.x] === boxState.filled) {
        return false
      }
    }
    return true
  }
  addShape() {
    this.activeShape = this.getNextShape()
    if (!this.canDrawShape(this.activeShape)) {
      this.stop()
      return
    }
    this.drawShape(this.activeShape)
    this.emit('state')
  }
  on(type, cb) {
    if (!this.handlers[type]) {
      this.handlers[type] = []
    }
    if (typeof cb === 'function') {
      this.handlers[type].push(cb)
    }
  }
  off(type, cb) {
    if (Array.isArray(this.handlers[type])) {
      const i = this.handlers[type].indexOf(cb)
      if (i !== -1) {
        this.handlers[type].splice(i, 1)
      }
    }
  }
  emit(type) {
    const cbs = this.handlers[type]
    if (Array.isArray(cbs)) {
      for (let i = 0, len = cbs.length; i < len; ++i) {
        cbs[i]()
      }
    }
  }
}