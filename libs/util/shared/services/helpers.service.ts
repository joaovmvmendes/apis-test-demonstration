export class HelpersServices {
  constructor() {
    // None empty constructor
  }

  static async setWait(timeOut: number) {
    //This service must be executed with half of the test's timeOut value as a parameter
    const foo = true;
    await new Promise((r) => setTimeout(r, timeOut));
    expect(foo).toBeDefined();
  }
}
