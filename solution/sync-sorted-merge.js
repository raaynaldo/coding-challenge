'use strict';

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const { MinPriorityQueue } = require('@datastructures-js/priority-queue');
  const logQueue = new MinPriorityQueue((item) => item.logEntry.date);

  for (let i = 0; i < logSources.length; i++) {
    const logEntry = logSources[i].pop();
    queueToHeap(logEntry, i, logQueue);
  } // O(n log(m)) | n = logSources.length, m = logEntries.length

  while (logQueue.size() > 0) {
    const queueItem = logQueue.dequeue();
    printer.print(queueItem.logEntry);

    const { index } = queueItem;
    const logEntry = logSources[index].pop();
    queueToHeap(logEntry, index, logQueue);
  } // O(n log(m)) | n = logSources.length, m = logEntries.length

  printer.done();

  return console.log('Sync sort complete.');
};
// Time: O(n log(m)) | n = logSources.length, m = logEntries.length
// Space: O(m) | m = logEntries.length

/**
 * Queue to Priority Queue if logEntry is not drained
 * @param {{date: DateTime, msg: string}|boolean} logEntry
 * @param {number} index
 * @param {MinPriorityQueue} heap
 */
function queueToHeap(logEntry, index, heap) {
  if (logEntry !== false) {
    const queueItem = {
      logEntry,
      index,
    };
    heap.enqueue(queueItem);
  }
}
