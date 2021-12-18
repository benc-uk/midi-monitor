import Alpine from 'https://unpkg.com/alpinejs@3.7.0/dist/module.esm.js'
import * as midi from '../lib/midi.js'

export const monitorComponent = () => ({
  log: [],
  paused: false,
  monitoredDevice: null,

  init() {
    this.$watch('log', () => {
      // Scroll to bottom
      this.$refs['monitor-log'].scrollTop = this.$refs['monitor-log'].scrollHeight
    })
  },

  listenForMonitoring() {
    if (this.monitoredDevice) {
      midi.access.inputs.get(this.monitoredDevice).removeEventListener('midimessage', this.messageListener)
    }

    const inputDevice = Alpine.store('config').inputDevice
    if (!inputDevice) return

    console.log(`### Start monitoring ${inputDevice}`)
    if (!midi.access.inputs.get(inputDevice)) {
      return
    }

    if (midi.access.inputs.get(inputDevice)) {
      this.log.push({ timestamp: new Date(), type: '[ Monitoring started ]' })
      this.messageListener = this.messageListener.bind(this)
      midi.access.inputs.get(inputDevice).addEventListener('midimessage', this.messageListener)
      this.monitoredDevice = inputDevice
    }
  },

  messageListener(msg) {
    if (this.paused) return

    let logEntry = midi.decodeMessage(msg)

    if (!logEntry) return
    // We ignore these otherwise the log would be flooded
    if (logEntry.type == 'Clock' || logEntry.type == 'MTC') return

    logEntry.cssClass = ''
    switch (logEntry.type) {
      case 'Note on':
      case 'Note off':
        logEntry.cssClass = 'msg-note'
        break
      case 'Control change':
        logEntry.cssClass = 'msg-control'
        break
    }
    if (logEntry.isSystem) {
      logEntry.cssClass = 'msg-system'
      logEntry.channel = 'All'
    }
    if (logEntry.type == 'Control change') {
      logEntry.details = midi.ccNumberToName(logEntry.data1)
    }
    if (logEntry.type == 'Note on' || logEntry.type == 'Note off') {
      logEntry.details = midi.noteNumberToName(logEntry.data1)
    }

    this.log.push(logEntry)
  },

  formatTimestamp(d) {
    let msecs = ('00' + d.getMilliseconds()).slice(-3)
    let secs = ('0' + d.getSeconds()).slice(-2)
    let mins = ('0' + d.getMinutes()).slice(-2)
    let hrs = ('0' + d.getHours()).slice(-2)
    return `${hrs}:${mins}:${secs}:${msecs}`
  }
})
