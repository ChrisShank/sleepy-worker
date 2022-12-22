// Reference on Atomics: https://github.com/tc39/proposal-ecmascript-sharedmem/blob/main/TUTORIAL.md

// Allocate a shared buffer with a single byte.
// -1 represents the value being unset
// 0 represents a falsy value
// 1 represents a truthy value
const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
const sharedArray = new Int32Array(sharedBuffer);
sharedArray[0] = -1;

const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' });

worker.addEventListener('message', (e) => {
  if (e.data.type === 'EVALUATE_CONDITION') {
    const response = confirm(`Is the condition '${e.data.conditionName} true?`);
    notifyWorker(response);
  }
});

function notifyWorker(response: boolean) {
  // update shared array with response
  Atomics.store(sharedArray, 0, response ? 1 : 0);
  // notify worker that there is a response
  Atomics.notify(sharedArray, 0, 1);
}

// send shared array to worker
worker.postMessage({ type: 'INITIALIZE_SHARED_BUFFER', sharedBuffer });

export {};
