let sharedArray: Int32Array;

self.addEventListener('message', (e) => {
  if (e.data.type === 'INITIALIZE_SHARED_BUFFER') {
    sharedArray = new Int32Array(e.data.sharedBuffer);
    evaluateCondition('isTrue');
    // adding a timeout to prompt again confirms that the worker is put to sleep.
    setTimeout(() => {
      evaluateCondition('isFalse');
    }, 1000);
  }
});

function evaluateCondition(conditionName: string) {
  // notify main thread to evaluate condition
  self.postMessage({ type: 'EVALUATE_CONDITION', conditionName });

  // reset value in buffer
  Atomics.store(sharedArray, 0, -1);

  // wait for main thread to respond by putting the worker to sleep
  // The worker will only sleep if the last argument equal to the *current* value at the specified index.
  // Sleeping is preferred to synchronously blocking which is more wasteful
  Atomics.wait(sharedArray, 0, -1);
  const response = Atomics.load(sharedArray, 0) === 1;
  console.log(response);
}

export {};
