//time function
export function currentTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedTime = ` ${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

//last word in string
export function lastStr(str) {
  const lastSpace = str.lastIndexOf(" ");
  const lastWord = str.substring(lastSpace + 1);
  return lastWord;
}

//clear whitespaces
export function nameId(name) {
  return name.replace(/\s/g, "");
}

//reverse nr in storage
export function maxAmount(storage) {
  let amountStat = [];
  storage.forEach((beer) => {
    amountStat.push(beer.amount);
  });

  return Math.max(...amountStat);
}
