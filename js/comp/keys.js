import Alpine from 'https://unpkg.com/alpinejs@3.7.0/dist/module.esm.js'
import * as midi from '../lib/midi.js'

export const keysComponent = () => ({
  playKey(key) {
    console.log('play key ' + key)
    midi.sendNoteOnMessage(Alpine.store('config').outputDevice, 1, key + 80, 100)
  },

  releaseKey(key) {
    console.log('release key ' + key)
    midi.sendNoteOffMessage(Alpine.store('config').outputDevice, 1, key + 80)
  }
})
