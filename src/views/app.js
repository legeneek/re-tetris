import React, { Component } from 'react'
import styled from 'styled-components'

import { flatArray } from '../public/utils'
import Tetris from '../tetris'

const Box = styled.div`
  background: ${props => props.active ? 'grey' : 'white'};
  width: 20px;
  height: 20px;
  border: 0.5px solid #fff;
  box-sizing: border-box;
  flex-grow: 1;
`

const CenterPanel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid gray;
`

const BlockDiv = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  width: 200px;
  height: 100px;
  border: 1px solid #fff;
  z-index: 1;
  background: #fff;
`

class App extends Component {
  constructor(props) {
    super(props)
    this.tetris = new Tetris()
    window.tetris = this.tetris
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
    } else if (key === ' ') {
      this.tetris.transformShape()
    }
  }
  render() {
    let boxes = flatArray(this.state.boxes.map((row, r) => {
      return row.map((v, c) => {
        return <Box active={v} key={`${r}-${c}`} />
      })
    }))
    let block = <BlockDiv />
    return (
      <CenterPanel>
        {block}
        {boxes}
      </CenterPanel>
    )
  }
}

export default App