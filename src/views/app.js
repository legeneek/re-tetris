import React, { Component } from 'react'
import styled from 'styled-components'

import { flatArray } from '../public/utils'

const Box = styled.div`
  background: ${props => props.active ? 'grey' : 'white'};
  width: 5%;
  height: 5%;
  border: 0.5px solid #fff;
  box-sizing: border-box;
  flex-grow: 1;
`

const CenterPanel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #000;
`

const rowLen = 20
const colLen = 20
const boxState = {
  filled: 1,
  empty: 0
}
const getInitShape = function () {
  return [
    { x: 9, y: 0 },
    { x: 9, y: 1 }, 
    { x: 10, y: 1 }
  ]
}

function activeShape(shape, state) {
  for (let i = 0, l = shape.length; i < l; ++i) {
    let dot = shape[i]
    state[dot.y][dot.x] = boxState.filled
  }
  shape.active = true
}

function canMoveShape(shape, dir, state) {
  if (!shape.active) return false

  if (dir === 'down') {
    let dot = shape[shape.length - 1]

    if (dot.y + 1 > rowLen - 1) {
      return false
    }

    let lastRow = shape.filter((b) => {
      return b.y === dot.y
    })
    for (let i = 0, len = lastRow.length; i < len; ++i) {
      let d = lastRow[i]
      if (state[d.y + 1][d.x] === boxState.filled) {
        return false
      }
    }
  }

  return true
}

function moveShape(shape, dir, state) {
  if (dir === 'down') {
    for (let i = 0, il = shape.length; i < il; ++i) {
      let dot = shape[i]
      state[dot.y][dot.x] = boxState.empty
    }

    for (let j = 0, jl = shape.length; j < jl; ++j) {
      let dot = shape[j]
      dot.y += 1
      state[dot.y][dot.x] = boxState.filled
    }
  }

  return true
}

class App extends Component {
  constructor(props) {
    super(props)
    let arr = []
    for (let i = 0; i < rowLen; ++i) {
      let col = []
      for (let j = 0; j < colLen; ++j) {
        col.push(0)
      }
      arr.push(col)
    }

    this.state = {
      boxes: arr
    }

    this.timer = null
    this.shape = getInitShape()
    this.newShape = true
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.newShape) {
        this.setState((state) => {
          activeShape(this.shape, state.boxes)
          return {
            boxes: state.boxes
          }
        })
        this.newShape = false
      }
      if (canMoveShape(this.shape, 'down', this.state.boxes)) {
        this.setState((state) => {
          moveShape(this.shape, 'down', state.boxes)
          return {
            boxes: state.boxes
          }
        })
      } else {
        this.shape = getInitShape()
        this.newShape = true
      }
    }, 200)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    let boxes = flatArray(this.state.boxes.map((row, r) => {
      return row.map((v, c) => {
        return <Box active={v} key={`${r}-${c}`} />
      })
    }))
    return (
      <CenterPanel>
        {boxes}
      </CenterPanel>
    )
  }
}

export default App