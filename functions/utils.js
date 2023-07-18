function isDate(value) {
  return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
}

function isFinite(value) {
  return Number(value) == value && Number.isFinite(parseFloat(value));
}