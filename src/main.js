import 'aframe'
import 'aframe-text-geometry-component'
import './style.scss'

const createBox = position => {
  let box = document.createElement('a-box')
  box.setAttribute('color', 'white')
  box.setAttribute('position', position)
  box.setAttribute('depth', 0.2)
  box.setAttribute('height', 1)
  box.setAttribute('width', 0.2)
  document.getElementById('scene').appendChild(box)
}

const setLightsIntensity = intencity => {
  const lights = document.querySelectorAll('a-light')
  for (const light of lights) {
    light.setAttribute('intensity', intencity)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  for (let i = 10.1; i >= -9.9; i -= 0.2) {
    createBox({ x: i.toFixed(1), y: 0, z: 10.1 })
  }

  for (let i = 10.1; i >= -9.9; i -= 0.2) {
    createBox({ x: -10.1, y: 0, z: i.toFixed(1) })
  }

  for (let i = -10.1; i <= 9.9; i += 0.2) {
    createBox({ x: i.toFixed(1), y: 0, z: -10.1 })
  }

  for (let i = -10.1; i <= 9.9; i += 0.2) {
    createBox({ x: 10.1, y: 0, z: i.toFixed(1) })
  }

  const fileInput = document.getElementById('file-input')
  const audio = document.getElementById('audio')
  let analyser, dataArray

  fileInput.addEventListener('change', e => {
    let src = URL.createObjectURL(e.target.files[0])
    audio.src = src

    if (analyser) return

    const context = new AudioContext()
    let audioSrc = context.createMediaElementSource(audio)
    analyser = context.createAnalyser()
    audioSrc.connect(analyser)
    analyser.connect(context.destination)
    analyser.fftSize = 2048

    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)

    renderFrame()
  })

  const renderFrame = () => {
    analyser.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length / 100

    const boxes = document.getElementsByTagName('a-box')

    for (let i = 0; i < 404; i++) {
      const { x, y, z } = boxes[i].object3D.position
      const height = (dataArray[i + 108] / 256) * 7.5
      const newY = height / 2
      boxes[i].setAttribute('height', height)
      boxes[i].object3D.position.set(x, newY, z)
    }

    setLightsIntensity(average)

    requestAnimationFrame(renderFrame)
  }
})
