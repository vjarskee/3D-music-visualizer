import 'aframe'

const createBox = (position: { x: number; y: number; z: number }) => {
  const box = document.createElement('a-box')
  box.setAttribute('color', 'white')
  box.setAttribute('position', position)
  box.setAttribute('depth', 0.2)
  box.setAttribute('height', 1)
  box.setAttribute('width', 0.2)
  document.getElementById('scene')?.appendChild(box)
}

const setLightsIntensity = (intencity: number) => {
  for (const light of document.querySelectorAll('a-light')) {
    light.setAttribute('intensity', intencity)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  for (let i = 10.1; i >= -9.9; i -= 0.2) {
    createBox({ x: Number(i.toFixed(1)), y: 0, z: 10.1 })
  }

  for (let i = 10.1; i >= -9.9; i -= 0.2) {
    createBox({ x: -10.1, y: 0, z: Number(i.toFixed(1)) })
  }

  for (let i = -10.1; i <= 9.9; i += 0.2) {
    createBox({ x: Number(i.toFixed(1)), y: 0, z: -10.1 })
  }

  for (let i = -10.1; i <= 9.9; i += 0.2) {
    createBox({ x: 10.1, y: 0, z: Number(i.toFixed(1)) })
  }

  const fileInput = document.getElementById('file-input')
  const audio: HTMLAudioElement = document.getElementById('audio') as HTMLAudioElement

  let analyser: AnalyserNode
  let dataArray: Uint8Array

  fileInput?.addEventListener('change', e => {
    if (!audio) return

    const target = e.target as HTMLInputElement

    if (!target) return
    if (!target.files || !target.files[0]) return

    const file = target.files[0]
    audio.src = URL.createObjectURL(file)

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

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length / 10

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
