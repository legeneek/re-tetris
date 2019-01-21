import React, { Component } from 'react'
import styled from 'styled-components'

import { flatArray } from '../public/utils'
import Tetris from '../tetris'

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

class App extends Component {
  constructor(props) {
    super(props)
    this.tetris = new Tetris()
    this.state = {
      boxes: this.tetris.state
    }
    this.handleKeydown = this.handleKeydown.bind(this)
  }
  componentDidMount() {
    const me = this

    window.addEventListener('keydown', (e) => {
      me.handleKeydown(e.key)
    })

    this.tetris.on('state', function() {
      me.setState((s) => {
        return me.tetris.state
      })
    })
    this.tetris.start()
  }
  handleKeydown (key) {
    if (key === 'a') {
      this.tetris.canMove('left') ? this.tetris.move('left') : ''
    } else if (key === 's') {
      this.tetris.canMove('down') ? this.tetris.move('down') : ''
    } else if (key === 'd') {
      this.tetris.canMove('right') ? this.tetris.move('right') : ''
    }
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