const fs = require('fs')

function writeGantt (
  gaant,
  clock,
  waitingTime,
  processCount,
  totalTurnAround,
) {
  const txtGaant = {
    proc: '',
    time: ''
  }

  gaant.proc.forEach(p => {
    const offset = 9
    txtGaant.proc += `${center(offset, p.length)}${p}${center(
      offset,
      p.length
    )}|`
  })

  gaant.time.forEach(t => {
    txtGaant.time += `${center(17, t.length)}${t}`
  })

  function center (space, length) {
    let x = ''
    x = ' '.repeat((space - length) / 2)
    return x
  }

  const outPut = []

  outPut[0] = outPut[2] = `${'-'.repeat(gaant.proc.length * 9)}\n`
  outPut[1] = `${txtGaant.proc}\n`
  outPut[3] = `${txtGaant.time}\n\n`
  outPut[4] = `utiliztion =  ${(((clock - waitingTime) / clock) * 100).toFixed(
    3
  )}%\n`
  outPut[5] = `Throughput = ${(processCount / clock).toFixed(3)}\n`
  outPut[6] = `Average Turnaround time = ${totalTurnAround / processCount}\n`
  return outPut
}

function write (v, filesNum) {
  fs.appendFileSync(`./outputs/output${filesNum}.txt`, v, err => {})
}

module.exports = { write, writeGantt }
