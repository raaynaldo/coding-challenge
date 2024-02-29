'use strict';

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {
  const { MinPriorityQueue } = require('@datastructures-js/priority-queue');
  const logQueue = new MinPriorityQueue((item) => item.logEntry.date);

  const promises = [];
  for (let i = 0; i < logSources.length; i++) {
    promises.push(await queueToHeap(logSources, i, logQueue));
  }
  await Promise.all(promises); // O(n log(m)) | n = logSources.length, m = logEntries.length

  while (logQueue.size() > 0) {
    const queueItem = logQueue.dequeue();
    printer.print(queueItem.logEntry);

    const { index } = queueItem;
    await queueToHeap(logSources, index, logQueue);
  } // O(n log(m)) | n = logSources.length, m = logEntries.length

  printer.done();

  return new Promise((resolve, reject) => {
    resolve(console.log('Async sort complete.'));
  });
};
// Time: O(n log(m)) n = logSources.length, m = logEntries.length
// Space: O(m) m = logEntries.length

/**
 * Queue to Priority Queue if logEntry is not drained
 * @param {LogSource[]} logSource
 * @param {number} index
 * @param {MinPriorityQueue} heap
 */
async function queueToHeap(logSources, index, heap) {
  const logEntry = await logSources[index].popAsync();
  if (logEntry !== false) {
    const queueItem = {
      logEntry,
      index,
    };
    heap.enqueue(queueItem);
  }
}
