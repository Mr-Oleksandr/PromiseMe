function empty() {}

class PromiseMe {
  constructor(executor) {
    this.queue = [];
    this.errorHandler = empty;
    this.finallyHandler = empty;

    try {
      executor.call(null, this.onResolve.bind(this), this.onReject.bind(this));
    } catch (e) {
      this.errorHandler(e);
    } finally {
      this.finallyHandler();
    }
  }

  onResolve(data) {
    this.queue.forEach((callback) => {
      data = callback(data);
    });

    this.finallyHandler();
  }

  onReject(error) {
    this.errorHandler(error);

    this.finallyHandler();
  }

  then(fn) {
    this.queue.push(fn);
    return this;
  }

  catch(fn) {
    this.errorHandler = fn;
    return this;
  }

  finally(fn) {
    this.finallyHandler = fn;
    return this;
  }

  static resolve(value) {
    return new Promise((resolve) => {
      resolve(value);
    });
  }

  static reject(value) {
    return new Promise((resolve, reject) => {
      reject(value);
    });
  }
}

module.exports = PromiseMe;