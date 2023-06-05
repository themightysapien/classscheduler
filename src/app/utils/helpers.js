export function numberBetween(min, max) {
  const numbers = []
  for (let i = min; i <= max; i++) {
    numbers.push(i)
  }

  return numbers
}

export function timeToSeconds(hour, minute = 0) {
  return Number(hour) * (60 * 60) + Number(minute) * 60
}

export function nTimesItemTemplate(template = {}, n = 0) {
  const result = []
  for (let i = 0; i < n; i++) {
    result.push({ ...template })
  }

  return JSON.parse(JSON.stringify(result))
}
export function randomColorHex() {
  return Math.floor(Math.random() * 16777215).toString(16)
}
export function randomColor() {
  var num = Math.round(0xffffff * Math.random())
  var r = num >> 16
  var g = (num >> 8) & 255
  var b = num & 255
  return 'rgb(' + r + ', ' + g + ', ' + b + ')'
}
function padZero(value, nLength = 2) {
  var sValue = value + '' // Converts to string

  if (sValue.length >= nLength) return sValue
  else {
    for (var nZero = 0; nZero < nLength; nZero++) sValue = '0' + sValue
    return sValue.substring(nLength - sValue.length, nLength)
  }
}
export function invertColor(rgb, bw = false) {
  let [r, g, b, a] = rgb.toString().match(/\d+/g).map(Number)

  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
  }
  // invert color components
  r = (255 - r).toString(16)
  g = (255 - g).toString(16)
  b = (255 - b).toString(16)
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b)
}

export function intersection(a, b) {
  return a.filter((v) => b.includes(v))
}
export function diff(a, b) {
  return a.filter((v) => !b.includes(v))
}
