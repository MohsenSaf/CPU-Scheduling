const setProcesses = require('./setProcesses')

const filesNum = 1

const [dl, q, processes, lP] = setProcesses(`./inputs/input${filesNum}.txt`)

const { write, writeGantt } = require('./CreateOutput')

const rr = []
const sjf = []
const waiting = []
let currentProc = null

let clock = 0
let waitingTime = 0
let processCount = Object.keys(processes).length
var tempDl = 0
let totalTurnAround = 0
const gantt = {
  proc: [],
  time: [],
  IOTime: []
}

while (true) {
  //Insert process by arrival time
  for (const [key, Value] of Object.entries(processes)) {
    if (Value.arrivalTime === clock) {
      insertProc(Value)
      delete processes[key]
    }
  }
  // Waiting queue 
  if (waiting.length) {
    waiting.forEach((proc, id) => {
      if (proc.queueNum === 1 && proc.waitingFlag) {
        insertProc(proc)
        waiting.splice(id, 1)
        proc.Qflag = true
        waitingFlag = false
      } else if (proc.bursts[0] === 0) {
        insertProc(proc)
        waiting.splice(id, 1)
        proc.bursts.shift()
      } else proc.bursts[0]--
    })
  }
  if (tempDl === 0) {
    if (currentProc) {
      //Enter process to cpc
      if (currentProc.bursts[0]) {
        // set Q to rr process (only first time)
        if (currentProc.queueNum === 1) {
          if (currentProc.Qflag) {
            tempQ = q
            currentProc.Qflag = false
          }
          if (tempQ !== 0) {
            currentProc.bursts[0]--
            tempQ--
          }
          if (tempQ === 0) {
            currentProc.Qflag = true
            rr.push(currentProc)
            gantt.time.push(clock.toString())
            currentProc = null
          }
        } else {
          currentProc.bursts[0]--
        }
      }
      // send process to waiting queue(I/O bursts)
      if (!!currentProc && currentProc.bursts[0] === 0) {
        currentProc.bursts.shift()
        if (currentProc.bursts.length) {
          waiting.push(currentProc)
        }
        if (currentProc.queueNum === 1) {
          rrFirstRound = true
        }
        gantt.time.push(clock.toString())
        if (!currentProc.bursts.length) {
          totalTurnAround += clock - currentProc.arrivalTime
        }

        currentProc = null
      }
    }
    // Set new process to current proc
    if (currentProc === null) {
      if (rr.length) {
        currentProc = rr.shift()
        setganttAndDl(currentProc)
      } else if (sjf.length) {
        currentProc = sjf.shift()
        setganttAndDl(currentProc)
      } else if (Object.keys(processes).length || waiting.length) {
        waitingTime++
        var tempProc = gantt.proc.pop()
        if (tempProc === 'idle') {
          gantt.time.pop()
        } else gantt.proc.push(tempProc)

        gantt.proc.push('idle')
        gantt.time.push(clock.toString())
        waitingTime++
      } else break
    }
  } else {
    waitingTime++
    tempDl--
    if (tempDl === 0) {
      if (gantt.proc.at(-3) === 'idle') {
        clock--
      }
      gantt.time.push(clock.toString())
      if (gantt.proc.at(-3) === 'idle') {
        clock++
      }
    }
  }
  clock++
}

writeGantt(
  gantt,
  clock,
  waitingTime,
  processCount,
  totalTurnAround,
).forEach(el => {
  write(el, filesNum)
})

function setganttAndDl (p) {
  if (clock) {
    tempDl = dl
    gantt.proc.push('dl', p.pname)
  } else gantt.proc.push(p.pname)
}

function insertProc (proc) {
  if (proc.queueNum === 1) {
    rr.push(proc)
  } else {
    sjf.push(proc)
    sjf.sort((a, b) => {
      return a.pname[1] - b.pname[1]
    })
    sjf.sort((a, b) => {
      return a.bursts[0] - b.bursts[0]
    })
  }
}
