export let access
//let bpm = null
let clocks = 0
let oldClocks = 0
let bpmListeners = []

const MSG_COMMON = 15
const MSG_AFTERTOUCH = 13
const MSG_CC = 11
const MSG_POLYTOUCH = 10
const MSG_NOTE_ON = 9
const MSG_NOTE_OFF = 8

const commands = {
  13: {
    desc: 'Aftertouch',
    value: 'pressure'
  },
  11: {
    desc: 'Control',
    value: 'CC'
  },
  9: {
    desc: 'Note on ',
    value: 'note'
  },
  8: {
    desc: 'Note off',
    value: 'note'
  }
}

export async function getAccess() {
  try {
    if (!access) {
      access = await navigator.requestMIDIAccess()
    }

    setInterval(calcBPM, 1000)

    return access
  } catch (err) {
    console.error('MIDI getAccess failed', err)
    //alert("Unable to get MIDI access\nYour browser doesn't support MIDI, try using Chrome or Edge")
  }
}

export function describeMessage(msg) {
  let status = byteToNibbles(msg.data[0])

  let cmd = status[0]
  let channel = status[1]

  let d = new Date()
  let msecs = ('00' + d.getMilliseconds()).slice(-3)
  let secs = ('0' + d.getSeconds()).slice(-2)
  let mins = ('0' + d.getMinutes()).slice(-2)
  let hrs = ('0' + d.getHours()).slice(-2)
  let timestamp = `${hrs}:${mins}:${secs}:${msecs}`

  if (cmd == MSG_COMMON) {
    let subcmd = ''

    // handle clock
    if (channel == 8) {
      clocks++
    }
    if (channel == 10) {
      subcmd = 'start'
      resetClock()
    }
    if (channel == 12) {
      subcmd = 'stop'
      resetClock()
    }
    if (subcmd) return `${timestamp} — Real-time ${subcmd}`
    return null
  }

  let text = commands[cmd]
  if (text) {
    let value2Text = msg.data[2] ? ` value: ${msg.data[2]} |` : ''
    return `${timestamp} — ${text.desc} | ${text.value}: ${msg.data[1]} |${value2Text} channel: ${channel + 1}`
  }

  return `${timestamp} — Unknown msg (${cmd},${channel}) | note: ${msg.data[1]} | channel: ${channel + 1}`
}

export function byteToNibbles(byte) {
  const high = byte & 0xf
  const low = byte >> 4
  return [low, high]
}

export function resetClock() {
  clocks = 0
  oldClocks = 0
}

function calcBPM() {
  if (oldClocks > 0) {
    let bpm = (clocks - oldClocks) * 2.5
    for (let listener of bpmListeners) {
      listener(bpm)
    }
  }
  oldClocks = clocks
}

export function addBPMListener(cb) {
  bpmListeners.push(cb)
}

export function removeBPMListeners() {
  bpmListeners = []
}
