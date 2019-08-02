class Group {
  constructor(set, map) {
    // the set should be a proper js Set,
    // elements of which ought to have 'name' attributes.

    this.set = set;
    this.map = map ? map : (a, b) => a.mult(b);
    this.constructMultiplicationTable();
  }

  mult(a, b) {
    return this.map(a, b);
  }

  constructMultiplicationTable() {
    const table = {};
    this.set.forEach((a) => {
      const row = {};
      this.set.forEach((b) => {
        row[b] = this.mult(a, b);
      });
      table[a] = row;
    });
    this.table = table;
  }

  displayTable() {
    Object.values(this.table).forEach((row) => {
      let rowString = Object.values(row).reduce((acc, el) => {
        if (el.name) return acc + el.name;
        return String(el);
      }, '');

      console.log(rowString);
    });
  }
}

class Matrix {
  constructor(rowCount, columnCount, null_value=0){
    this.grid = [];
    for (let i = 0; i < rowCount; i++) {
      this.grid.push(new Array());
      for (let j = 0; j < columnCount; j++) {
        this.grid[i].push(null_value);
      }
    }
    this.rowCount = rowCount;
    this.columnCount = columnCount;
  }

  column(idx) {
    return this.grid.map(row => row[idx]);
  }

  mult(other) {
    if (typeof other === 'number') {
      return this.grid.map(row => (
          row.map(entry => (entry * other))
      ));
    }
    if (other instanceof Matrix) {
      return this.grid.map((row, i) => (
        row.map((entry, j) => (
          this.dot(row, other.column(j))
        ))
      ));
    }

    throw new Error('Input error: invalid input type for matrix multiplication');
  }

  dot(a, b) {
    if (a.length !== b.length) throw new Error(
      'Input error: vectors differ in dimension'
    );

    return a.reduce((acc, el, idx) => {
      return acc + (el * b[idx]);
    }, 0);
  }
}

class SymmetryAsMatrix extends Matrix {
  constructor(order, index) {
    super(order, order);
    this.order = order;
    this.index = index;
    this.name = String(index);
    this.factorials = { 0: 1, 1: 1 };
    if (index >= this.factorial(order)) throw new Error(
      'The requested symmetry exceeds the specified order.'
    );
    this.calculatePermutation();
    this.generateMatrix();
  }

  factorial(n) {
    if (this.factorials[n]) {
      return this.factorials[n];
    }
    const response = n * this.factorial(n - 1);
    this.factorials[n] = response;
    return response;
  }

  calculatePermutation() {
    // This method uses a clever mechanism to convert an index to a
    // particular permutation, by way of factoriadic numbers.
    // Clear explanation found here: https://bit.ly/2T0haik

    let glyphs = '0123456789'.split('');
    let factoriad = '';
    let radix = this.order - 1;

    let remainder = this.index;
    while (radix >= 0) {
      factoriad += String(Math.floor(remainder / this.factorial(radix)));
      remainder %= this.factorial(radix);
      radix -= 1;
    }
    let sequence = [];
    factoriad.split('').forEach((digit) => {
      sequence = sequence.concat(glyphs.splice(Number(digit), 1));
    });
    this.permutation = sequence;
  }

  generateMatrix() {
    // Constructs a permutation matrix. This is an excessively complex
    // representation of the symmetry. They're more directly implemented
    // and composed using arrays or maps. But this way is more fun!

    this.permutation.forEach((el, idx) => {
      this.grid[idx][el] = 1;
    });
  }

  calculateIndex(matrix) {
    // let result = 1;
    // matrix.forEach((row, idx) => {
    //   if (row.indexOf(1) > idx) {
    //     result += (this.factorial(this.order - (idx + 1)) * (row.indexOf(1) - idx));
    //   }
    // });
    // return result;
  }

  mult(other) {
    const result = super.mult(other);
    const newIndex = this.calculateIndex(result);
    return new SymmetryAsMatrix(this.order, newIndex);
  }
}

class SymmetricGroup extends Group {
  constructor(n) {
    const set = new Set();
    for (let i = 1; i <= n; i++) {
      set.add(new SymmetryAsMatrix(n, i));
    }
    super(set);
  }
}

module.exports = { SymmetricGroup, SymmetryAsMatrix, Group, Matrix };
