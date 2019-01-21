const boxState = {
  filled: 1,
  empty: 0
}
const rowLen = 20
const colLen = 20
const interval = 1000

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
    this.activeShape = null
  }
  start () {
    const me = this
    function loop () {
      if (me.activeShape) {
        if (!me.canMove('down')) {
          me.activeShape = null
        } else {
          me.move('down')
        }
      } else {
        me.activeShape = me.getNextShape()
        if(!me.addShape(me.activeShape)) {
          me.emit('over')
          me.stop()
        }
      }

      this.timer = setTimeout(loop, interval)
    }

    this.timer = setTimeout(loop, interval)
  }
  stop () {
    clearTimeout(this.timer)
  }
  canMove (dir) {
    if (!this.activeShape) {
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
  move (dir) {
    for (let i = 0; i < this.activeShape.length; ++i) {
      let dot = this.activeShape[i]
      this.state[dot.y][dot.x] = boxState.empty
    }
  
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
  getNextShape () {
    return [
      { x: 9, y: 0 },
      { x: 9, y: 1 }, 
      { x: 10, y: 1 }
    ]
  }
  addShape (s) {
    let i, len, dot
    for (i = 0, len = s.length; i < len; ++i) {
      dot = s[i]
      if (this.state[dot.y][dot.x] === boxState.filled) {
        return false
      }
    }

    for (i = 0, len = s.length; i < len; ++i) {
      dot = s[i]
      this.state[dot.y][dot.x] === boxState.filled
    }
    this.emit('state')
  }
  on (type, cb) {
    if (!this.handlers[type]) {
      this.handlers[type] = []
    }
    if (typeof cb === 'function') {
      this.handlers[type].push(cb)
    }
  }
  off (type, cb) {
    if (Array.isArray(this.handlers[type])) {
      const i = this.handlers[type].indexOf(cb)
      if (i !== -1) {
        this.handlers[type].splice(i, 1)
      }
    }
  }
  emit (type) {
    const cbs = this.handlers[type]
    if (Array.isArray(cbs)) {
      for (let i = 0, len = cbs.length; i < len; ++i) {
        cbs[i]()
      }
    }
  }
}