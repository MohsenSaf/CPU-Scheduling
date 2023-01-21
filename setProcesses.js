function setProcesses (data) {
  const fs = require('fs')

  const readFile = function (file) {
    return fs.readFileSync(file).toString().split('\n')
  }

  const f = readFile(data)

  const q = +f.shift()
  const dl = +f.shift()

  const processes = {}

  f.forEach(element => {
    const pname = element.split(':')[0]

    let bursts = element.split(':')[1]

    bursts = bursts.split(',')

    let queueNum = +bursts.shift()
    let arrivalTime = +bursts.shift()

    processes[pname] = {
      pname: pname,
      queueNum: queueNum,
      arrivalTime: arrivalTime,
      bursts: `${bursts}`,
      Qflag: true,
      waitingFlag: false
    }

    processes[pname].bursts = JSON.parse('[' + processes[pname].bursts + ']')
  })

  return [dl, q, processes]
}

module.exports = setProcesses
