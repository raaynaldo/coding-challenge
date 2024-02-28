'use strict';

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const { MinPriorityQueue } = require('@datastructures-js/priority-queue');
  const logQueue = new MinPriorityQueue((log) => log.date);

  const Promises = logSources.map(async (logSource) => {
    return logQueue.enqueue(await logSource.popAsync());
  });
  await Promise.all(Promises); // n log(n)

  while (logQueue.size() > 0) {
    const logEntry = logQueue.dequeue();
    printer.print(logEntry);
  } // n log(n)

  printer.done();

  return new Promise((resolve, reject) => {
    resolve(console.log('Async sort complete.'));
  });
};
