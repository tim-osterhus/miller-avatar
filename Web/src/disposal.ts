export class DisposalBag {
  private disposed = false;
  private readonly callbacks: Array<() => void> = [];
  private readonly recordedFailures: unknown[] = [];

  get failures(): readonly unknown[] {
    return this.recordedFailures;
  }

  add(callback: () => void): void {
    if (this.disposed) {
      this.run(callback);
      return;
    }
    this.callbacks.push(callback);
  }

  dispose(): readonly unknown[] {
    if (this.disposed) return [];
    this.disposed = true;
    const failures: unknown[] = [];
    for (const callback of this.callbacks.splice(0).reverse()) {
      const failure = this.run(callback);
      if (failure !== undefined) failures.push(failure);
    }
    return failures;
  }

  private run(callback: () => void): unknown | undefined {
    try {
      callback();
      return undefined;
    } catch (error) {
      this.recordedFailures.push(error);
      return error;
    }
  }
}
