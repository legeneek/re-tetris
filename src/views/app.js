import React, { Component } from 'react'
import styled from 'styled-components'

import { flatArray } from '../public/utils'

const Box = styled.div`
  background: ${props => props.active ? 'gray' : 'white'};
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
    this.state = {
      boxes: []
    }
    this.worker = new Worker('./static/controller.js')
    this.handleKeydown = this.handleKeydown.bind(this)
  }
  componentDidMount() {
    const me = this

    window.addEventListener('keydown', (e) => {
      me.handleKeydown(e.key)
    })
    
    this.worker.addEventListener('message', (e) => {
      let d = e.data
      console.log('receive: ', d)
      if (d.type === 'state') {
        me.setState((s) => {
          return {
            boxes: JSON.parse(d.data)
          }
        })
      }
      
    })

    this.worker.postMessage({cmd: 'start'})
  }
  handleKeydown (key) {
    if (key === 'a') {
      this.worker.postMessage({cmd: 'move', data: 'left'})
    } else if (key === 's') {
      this.worker.postMessage({cmd: 'move', data: 'down'})
    } else if (key === 'd') {
      this.worker.postMessage({cmd: 'move', data: 'right'})
    } else if (key === ' ') {
      this.worker.postMessage({cmd: 'transform'})
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