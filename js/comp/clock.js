import Alpine from 'https://unpkg.com/alpinejs@3.7.0/dist/module.esm.js'
import * as midi from '../lib/midi.js'

export const clockComponent = () => ({
  bpm: -1,
  ticks: 0,
  prevTicks: 0,
  monitoredDevice: null,
  bpmBuffer: [],
  lastTransport: '',
  sendClock: false,
  sendBpm: 120,

  init() {
    console.log('### Initializing clock')
    this.bpm = -1
    this.lastTransport = '···'
    this.calcBPM = this.calcBPM.bind(this)

    setInterval(() => {
      this.calcBPM()
    }, 1000)
  },

  resetClock() {
    this.ticks = 0
    this.prevTicks = 0
    this.bpm = -1
  },

  calcBPM() {
    if (this.prevTicks > 0) {
      const tempBpm = (this.ticks - this.prevTicks) * 2.5

      // We calc the average of the last 3 BPMs readings for a more stable result
      this.bpmBuffer.push(tempBpm)
      if (this.bpmBuffer.length > 3) {
        this.bpmBuffer.shift()
      }
      let sum = 0
      this.bpmBuffer.forEach((bpm) => {
        sum += bpm
      })
      this.bpm = Math.round(sum / this.bpmBuffer.length)
    }

    this.prevTicks = this.ticks
  },

  listenForClock() {
    if (this.monitoredDevice) {
      midi.access.inputs.get(this.monitoredDevice).removeEventListener('midimessage', this.messageListener)
    }

    const inputDevice = Alpine.store('config').inputDevice
    if (!midi.access.inputs.get(inputDevice)) {
      return
    }

    this.resetClock()

    if (midi.access.inputs.get(inputDevice)) {
      console.log(`### Start CLOCK monitoring ${inputDevice}`)
      this.messageListener = this.messageListener.bind(this)
      midi.access.inputs.get(inputDevice).addEventListener('midimessage', this.messageListener)
      this.monitoredDevice = inputDevice
    }
  },

  messageListener(msg) {
    let logEntry = midi.decodeMessage(msg)
    if (!logEntry) return

    if (logEntry.type == 'Continue' || logEntry.type == 'Stop' || logEntry.type == 'Start') {
      this.lastTransport = logEntry.type
    }

    if (logEntry.type == 'Clock') {
      this.ticks++
    }
  }
})
