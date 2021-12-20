import Alpine from 'https://unpkg.com/alpinejs@3.7.0/dist/module.esm.js'
import * as midi from '../lib/midi.js'

export const toolsComponent = () => ({
  channel: 0,
  ccList: [],
  ccNumber: 0,
  ccValue: 0,

  init() {
    for (let n = 0; n < 128; n++) {
      this.ccList.push({
        name: `Number: ${n}`,
        number: n
      })
    }
  },

  sendCC() {
    midi.sendCCMessage(Alpine.store('config').outputDevice, this.channel, this.ccNumber, parseInt(this.ccValue))
  },

  sendNRPN() {
    // midi.sendNRPNMessage(Alpine.store('config').outputDevice, this.channel, this.ccNumber, parseInt(this.ccValue))
  }
})
