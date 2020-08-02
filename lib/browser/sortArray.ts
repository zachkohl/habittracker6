export default function sortList(array) {
  function compare(a, b) {
    console.log(`${a.reacreactOrdertOder} -${b.reactOrder}`);
    return a.reactOrder - b.reactOrder;
  }
  return array.sort(compare);
}
