let sharedArray: Int32Array;

self.addEventListener('message', (e) => {
  if (e.data.type === 'INITIALIZE_SHARED_BUFFER') {
    sharedArray = new Int32Array(e.data.sharedBuffer);

    Atomics.store(sharedArray, 0, -1); // reset buffer
    self.postMessage({ type: 'EVALUATE_CONDITION', conditionName: 'isTrue' }); // notify main thread to evaluate condition
    while (Atomics.load(sharedArray, 0) == -1) {} // block until memory is changed
    console.log(Atomics.load(sharedArray, 0));
  }
});

export {};
