export class Clock {
  private static time: number = 0;
  private static interval: number | null;

  public static setTime(t: number) {
    this.time = t;
  }

  public static getTime() {
    return this.time;
  }

  public static play() {
    this.time = 0;
    const delta = 1000 / 30;
    this.interval = setInterval(() => {
      console.log("time is", this.time);
      this.time += delta / 1000;
      // this.time += delta;
    }, delta);
  }

  public static pause() {
    if (this.interval) clearInterval(this.interval);
  }
}

//@ts-ignore
window.Clock = Clock;
