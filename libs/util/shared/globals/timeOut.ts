export const timeOuts = {
  connection: 20000,
};

export function calculaTimeOut(timeOutBase: number, timeOutDynamic: number) {
  return timeOutBase + timeOutDynamic;
}
