// Global MIDI access
export let access

export const MSG_STATUS_SYSTEM = 15

// System messages
export const MSG_SYSEX_START = 0
export const MSG_MTC = 1
export const MSG_SONG_POSITION = 2
export const MSG_SONG_SELECT = 3
export const MSG_TUNE_REQUEST = 6
export const MSG_SYSEX_END = 7
export const MSG_CLOCK = 8
export const MSG_START = 9
export const MSG_CONTINUE = 10
export const MSG_STOP = 11
export const MSG_ACTIVE_SENSE = 12
export const MSG_RESET = 13

// Normal messages, with data values
export const MSG_PITCH_BEND = 14
export const MSG_CHAN_AFTERTOUCH = 13
export const MSG_PROG_CHANGE = 12
export const MSG_CONTROL_CHANGE = 11
export const MSG_POLY_AFTERTOUCH = 10
export const MSG_NOTE_ON = 9
export const MSG_NOTE_OFF = 8

// =================================================
// Attempt to get MIDI access and hold it globally
// =================================================
export async function getAccess() {
  try {
    if (!access) {
      access = await navigator.requestMIDIAccess()
    }

    return access
  } catch (err) {
    console.error('MIDI getAccess failed', err)
  }
}

export function decodeMessage(msg) {
  let output = {
    timestamp: new Date(),
    type: '',
    channel: 0,
    command: null,
    data1: null,
    data2: null,
    isSystem: false
  }

  let status = byteToNibbles(msg.data[0])
  output.command = status[0]
  output.channel = status[1]

  // System common messages (clock, stop, start, etc)
  // Note. Here the channel nibble actually denotes message *sub-type* NOT the channel, as these messages are global
  if (output.command == MSG_STATUS_SYSTEM) {
    output.isSystem = true

    switch (output.channel) {
      case MSG_SYSEX_START:
        output.type = 'SysEx start'
        break
      case MSG_MTC:
        output.type = 'MTC'
        break
      case MSG_SONG_POSITION:
        output.type = 'Song position'
        break
      case MSG_SONG_SELECT:
        output.type = 'Song select'
        break
      case MSG_TUNE_REQUEST:
        output.type = 'Tune request'
        break
      case MSG_SYSEX_END:
        output.type = 'SysEx end'
        break
      case MSG_CLOCK:
        output.type = 'Clock'
        break
      case MSG_START:
        output.type = 'Start'
        break
      case MSG_CONTINUE:
        output.type = 'Continue'
        break
      case MSG_STOP:
        output.type = 'Stop'
        break
      case MSG_ACTIVE_SENSE:
        output.type = 'Active sense'
        break
      case midi:
        output.type = 'Reset'
        break
    }
    return output
  }

  switch (output.command) {
    case MSG_NOTE_ON:
      output.type = 'Note on'
      break
    case MSG_NOTE_OFF:
      output.type = 'Note off'
      break
    case MSG_CONTROL_CHANGE:
      output.type = 'Control change'
      break
    case MSG_PROG_CHANGE:
      output.type = 'Program change'
      break
    case MSG_CHAN_AFTERTOUCH:
      output.type = 'Channel aftertouch'
      break
    case MSG_PITCH_BEND:
      output.type = 'Pitch bend'
      break
    case MSG_POLY_AFTERTOUCH:
      output.type = 'Poly aftertouch'
      break
  }

  output.data1 = msg.data[1]
  output.data2 = msg.data[2]

  return output

  /*
  // Capture 'Bank Select' CCs as a special case
  if (msg.data[1] == 0 && cmd == MSG_CC) return `${timestamp} — Bank Select | MSB: ${msg.data[2]} | channel: ${channel + 1}`
  if (msg.data[1] == 32 && cmd == MSG_CC) return `${timestamp} — Bank Select | LSB: ${msg.data[2]} | channel: ${channel + 1}`

  // Capture 'NRPN' as a special case
  if (msg.data[1] == 98 && cmd == MSG_CC) return `${timestamp} — NRPN | LSB: ${msg.data[2]} | channel: ${channel + 1}`
  if (msg.data[1] == 99 && cmd == MSG_CC) return `${timestamp} — NPRN | MSB: ${msg.data[2]} | channel: ${channel + 1}`
  if (msg.data[1] == 6 && cmd == MSG_CC) return `${timestamp} — NRPN Value | MSB: ${msg.data[2]} | channel: ${channel + 1}`
  if (msg.data[1] == 38 && cmd == MSG_CC) return `${timestamp} — NPRN Value | LSB: ${msg.data[2]} | channel: ${channel + 1}`
*/
}

// ===================================================
// Split a byte into two nibbles
// ===================================================
export function byteToNibbles(byte) {
  const high = byte & 0xf
  const low = byte >> 4
  return [low, high]
}

// Convert MIDI CC number to a name
export function ccNumberToName(number) {
  switch (number) {
    case 1:
      return 'Modulation'
    case 2:
      return 'Breath'
    case 4:
      return 'Foot Controller'
    case 5:
      return 'Portamento Time'
    case 6:
      return 'Data Entry MSB'
    case 7:
      return 'Main Volume'
    case 8:
      return 'Balance'
    case 10:
      return 'Pan'
    case 11:
      return 'Expression'
    case 12:
      return 'Effect Control 1'
    case 13:
      return 'Effect Control 2'
    case 16:
      return 'General Purpose 1'
    case 17:
      return 'General Purpose 2'
    case 18:
      return 'General Purpose 3'
    case 19:
      return 'General Purpose 4'
    case 32:
      return 'Bank Select'
    case 33:
      return 'Modulation Wheel'
    case 34:
      return 'Breath Controller'
    case 36:
      return 'Foot Pedal'
    case 38:
      return 'Data Entry MSB'
    case 64:
      return 'Sustain'
    case 65:
      return 'Portamento'
    case 66:
      return 'Sostenuto'
    case 67:
      return 'Soft Pedal'
    case 68:
      return 'Legato Footswitch'
    case 69:
      return 'Hold 2'
    case 70:
      return 'Sound Variation'
    case 71:
      return 'Sound Controller 2'
    case 72:
      return 'Sound Controller 3'
    case 73:
      return 'Sound Controller 4'
    case 74:
      return 'Sound Controller 5'
    case 75:
      return 'Sound Controller 6'
    case 76:
      return 'Sound Controller 7'
    case 77:
      return 'Sound Controller 8'
    case 78:
      return 'Sound Controller 9'
    case 79:
      return 'Sound Controller 10'
    case 80:
      return 'General Purpose 5'
    case 81:
      return 'General Purpose 6'
    case 82:
      return 'General Purpose 7'
    case 83:
      return 'General Purpose 8'
    case 84:
      return 'Portamento Control'
    case 91:
      return 'Effects 1 Depth'
    case 92:
      return 'Effects 2 Depth'
    case 93:
      return 'Effects 3 Depth'
    case 94:
      return 'Effects 4 Depth'
    case 95:
      return 'Effects 5 Depth'
    case 96:
      return 'Data Increment'
    case 97:
      return 'Data Decrement'
    case 98:
      return 'Non-Registered Parameter Number LSB'
    case 99:
      return 'Non-Registered Parameter Number MSB'
    case 100:
      return 'Registered Parameter Number LSB'
    case 101:
      return 'Registered Parameter Number MSB'
    case 120:
      return 'All Sound Off'
    case 121:
      return 'All Controllers Off'
    case 122:
      return 'Local Keyboard'
    case 123:
      return 'All Notes Off'
    case 124:
      return 'Omni Mode Off'
    case 125:
      return 'Omni Mode On'
    case 126:
      return 'Mono Operation'
    case 127:
      return 'Poly Operation'
    default:
      return 'Not defined'
  }
}

// MIDI note number to name
export function noteNumberToName(number) {
  switch (number) {
    case 0:
      return 'C-2'
    case 1:
      return 'C#-2'
    case 2:
      return 'D-2'
    case 3:
      return 'D#-2'
    case 4:
      return 'E-2'
    case 5:
      return 'F-2'
    case 6:
      return 'F#-2'
    case 7:
      return 'G-2'
    case 8:
      return 'G#-2'
    case 9:
      return 'A-2'
    case 10:
      return 'A#-2'
    case 11:
      return 'B-2'
    case 12:
      return 'C-1'
    case 13:
      return 'C#-1'
    case 14:
      return 'D-1'
    case 15:
      return 'D#-1'
    case 16:
      return 'E-1'
    case 17:
      return 'F-1'
    case 18:
      return 'F#-1'
    case 19:
      return 'G-1'
    case 20:
      return 'G#-1'
    case 21:
      return 'A-1'
    case 22:
      return 'A#-1'
    case 23:
      return 'B-1'
    case 24:
      return 'C0'
    case 25:
      return 'C#0'
    case 26:
      return 'D0'
    case 27:
      return 'D#0'
    case 28:
      return 'E0'
    case 29:
      return 'F0'
    case 30:
      return 'F#0'
    case 31:
      return 'G0'
    case 32:
      return 'G#0'
    case 33:
      return 'A0'
    case 34:
      return 'A#0'
    case 35:
      return 'B0'
    case 36:
      return 'C1'
    case 37:
      return 'C#1'
    case 38:
      return 'D1'
    case 39:
      return 'D#1'
    case 40:
      return 'E1'
    case 41:
      return 'F1'
    case 42:
      return 'F#1'
    case 43:
      return 'G1'
    case 44:
      return 'G#1'
    case 45:
      return 'A1'
    case 46:
      return 'A#1'
    case 47:
      return 'B1'
    case 48:
      return 'C2'
    case 49:
      return 'C#2'
    case 50:
      return 'D2'
    case 51:
      return 'D#2'
    case 52:
      return 'E2'
    case 53:
      return 'F2'
    case 54:
      return 'F#2'
    case 55:
      return 'G2'
    case 56:
      return 'G#2'
    case 57:
      return 'A2'
    case 58:
      return 'A#2'
    case 59:
      return 'B2'
    case 60:
      return 'C3'
    case 61:
      return 'C#3'
    case 62:
      return 'D3'
    case 63:
      return 'D#3'
    case 64:
      return 'E3'
    case 65:
      return 'F3'
    case 66:
      return 'F#3'
    case 67:
      return 'G3'
    case 68:
      return 'G#3'
    case 69:
      return 'A3'
    case 70:
      return 'A#3'
    case 71:
      return 'B3'
    case 72:
      return 'C4'
    case 73:
      return 'C#4'
    case 74:
      return 'D4'
    case 75:
      return 'D#4'
    case 76:
      return 'E4'
    case 77:
      return 'F4'
    case 78:
      return 'F#4'
    case 79:
      return 'G4'
    case 80:
      return 'G#4'
    case 81:
      return 'A4'
    case 82:
      return 'A#4'
    case 83:
      return 'B4'
    case 84:
      return 'C5'
    case 85:
      return 'C#5'
    case 86:
      return 'D5'
    case 87:
      return 'D#5'
    case 88:
      return 'E5'
    case 89:
      return 'F5'
    case 90:
      return 'F#5'
    case 91:
      return 'G5'
    case 92:
      return 'G#5'
    case 93:
      return 'A5'
    case 94:
      return 'A#5'
    case 95:
      return 'B5'
    case 96:
      return 'C6'
    case 97:
      return 'C#6'
    case 98:
      return 'D6'
    case 99:
      return 'D#6'
    case 100:
      return 'E6'
    case 101:
      return 'F6'
    case 102:
      return 'F#6'
    case 103:
      return 'G6'
    case 104:
      return 'G#6'
    case 105:
      return 'A6'
    case 106:
      return 'A#6'
    case 107:
      return 'B6'
    case 108:
      return 'C7'
    case 109:
      return 'C#7'
    case 110:
      return 'D7'
    case 111:
      return 'D#7'
    case 112:
      return 'E7'
    case 113:
      return 'F7'
    case 114:
      return 'F#7'
    case 115:
      return 'G7'
    case 116:
      return 'G#7'
    case 117:
      return 'A7'
    case 118:
      return 'A#7'
    case 119:
      return 'B7'
    case 120:
      return 'C8'
    case 121:
      return 'C#8'
    case 122:
      return 'D8'
    case 123:
      return 'D#8'
    case 124:
      return 'E8'
    case 125:
      return 'F8'
    case 126:
      return 'F#8'
    case 127:
      return 'G8'
    default:
      return 'Unknown'
  }
}