import Alpine from 'https://unpkg.com/alpinejs@3.7.0/dist/module.esm.js'
import * as midi from '../lib/midi.js'

export const keysComponent = () => ({
  offset: 48,
  velocity: 100,

  playKey(key) {
    midi.sendNoteOnMessage(Alpine.store('config').outputDevice, this.$store.config.channel, parseInt(this.offset) + key, parseInt(this.velocity))
  },

  releaseKey(key) {
    midi.sendNoteOffMessage(Alpine.store('config').outputDevice, this.$store.config.channel, parseInt(this.offset) + key)
  }
})
