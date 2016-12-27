export default class Bot1 {
  main(field, XorO) {
    for (let y = 0; y !== field.length; y++) {
      let row = field[y];
      for (let x = 0; x !== row.length; x++) {
        if (row[x] === '.') {
          return [x, y];
        }
      }
    }

    return [-1, -1];
  }
}
