


const { Observable } = require("rxjs");
const { Worker } = require("worker_threads");
const observe = (message) => {
  return Observable.create((subject) => {
    const worker = new Worker("./worker/worker.js");
    worker.on("message", (message) => subject.next(message));
    worker.on("error", (error) => console.log(error));
    worker.on("exit", (code) => {
      if (code !== 0) new Error(`Worker stopped with exit code ${code}`);
    });
    worker.postMessage(message);
  });
};

exports.observe = observe;
