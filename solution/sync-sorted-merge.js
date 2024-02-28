'use strict';

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const { MinPriorityQueue } = require('@datastructures-js/priority-queue');
  const logQueue = new MinPriorityQueue((log) => log.date);

  logSources.forEach((logSource) => {
    const logEntry = logSource.pop();
    logQueue.enqueue(logEntry);
  }); // n log(n)

  while (logQueue.size() > 0) {
    const logEntry = logQueue.dequeue();
    printer.print(logEntry);
  } // n log(n)

  printer.done();

  return console.log('Sync sort complete.');
};
