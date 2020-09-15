export default function sortList(array) {
  function compare(a, b) {
    return a.reactOrder - b.reactOrder;
  }
  return array.sort(compare);
}
