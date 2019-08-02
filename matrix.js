class Matrix {
  constructor(rowCount, columnCount, null_value=0){
    this.rows = new Array(rowCount);
    this.rows = this.rows.map(row => (new Array(columnCount).fill(null_value)));
    this.rowCount = rowCount;
    this.columnCount = columnCount;
  }

  column(idx) {
    this.rows.map(row => row[idx]);
  }

  mult(other) {
    if (typeof other === 'number') {
      return this.rows.map(row => (
          row.map(entry => (entry * other))
      ));
    }
    if (other instanceof Matrix) {
      return this.rows.map((row, i) => (
        row.map((entry, j) => (
          this.dot(row, other.column(j))
        ))
      ));
    }

    throw new Error('Input error: invalid input type');
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

module.exports = {
  Matrix,
};
