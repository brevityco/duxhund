export default function isPlainObject(object) {
  if (typeof object !== 'object' || object === null) {
    return false
  }

  let proto = object

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(object) === proto
}
