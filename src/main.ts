// Index 0 represents the monotonic count to notify the worker of a result
// Index 1 represents the result of the condition
const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
const sharedArray = new Int32Array(sharedBuffer);
const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' });

worker.addEventListener('message', (e) => {
  if (e.data.type === 'EVALUATE_CONDITION') {
    setTimeout(() => {
      Atomics.store(sharedArray, 0, 1);
      console.log('notify');
    }, 1000);
  }
});

worker.postMessage({ type: 'INITIALIZE_SHARED_BUFFER', sharedBuffer });

export {};
