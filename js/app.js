import Alpine from 'https://unpkg.com/alpinejs@3.7.0/dist/module.esm.js'
import { monitorComponent } from './comp/monitor.js'
import { clockComponent } from './comp/clock.js'
import * as midi from './lib/midi.js'

Alpine.data('app', () => ({
  page: '',
  inputDevices: [],
  outputDevices: [],
  midiAccess: null,

  async init() {
    if (!window.location.hash) {
      window.location.hash = '#monitor'
      this.page = '#monitor'
    }
    this.page = window.location.hash
    await midi.getAccess(this.setupDevices)
    midi.access.onstatechange = () => this.setupDevices()
    this.setupDevices()

    // Connect to device if present
    const inputDevice = Alpine.store('config').inputDevice
    if (inputDevice && midi.access.inputs.get(inputDevice)) {
      console.log(`### Using input device ${midi.access.inputs.get(inputDevice).name}`)
      this.$dispatch('midi-ready')
    } else if (inputDevice) {
      console.log(`### WARNING! Device ${inputDevice} is no longer present`)
      Alpine.store('config').inputDevice = ''
      Alpine.store('config').save()
    }
  },

  setupDevices() {
    console.log('### Detecting MIDI devices...')
    this.inputDevices = []
    this.outputDevices = []
    for (let input of midi.access.inputs.values()) {
      console.log(` <- ${input.id}:${input.name}:${input.manufacturer}`)

      this.inputDevices.push({
        name: input.name,
        manufacturer: input.manufacturer,
        id: input.id
      })
    }

    for (let output of midi.access.outputs.values()) {
      console.log(` -> ${output.id}:${output.name}:${output.manufacturer}`)

      this.outputDevices.push({
        name: output.name,
        manufacturer: output.manufacturer,
        id: output.id
      })
    }

    if (localStorage.getItem('config')) {
      Alpine.store('config', JSON.parse(localStorage.getItem('config')))
    }
    Alpine.store('config').save = () => {
      localStorage.setItem('config', JSON.stringify(Alpine.store('config')))
    }
  }
}))

Alpine.data('monitor', monitorComponent)
Alpine.data('clock', clockComponent)

Alpine.store('config', {
  inputDevice: '',
  outputDevice: ''
})

Alpine.start()
