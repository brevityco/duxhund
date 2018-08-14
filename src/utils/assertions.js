import isPlainObject from './isPlainObject'

export function assertType(object, type, { funcName, argName, optional }) {
  if (!hasType(object, type, optional)) {
    throw new Error(
      `${funcName} expects the '${argName}' argument to be ${outputType(
        type
      )}, but instead received '${typeof object}'.`
    )
  }
}

export function assertValuesType(
  object,
  type,
  { funcName, argName, optional }
) {
  if (optional && !object) return

  const invalidKeys = Object.keys(object).filter(
    key => !hasType(object[key], type)
  )

  if (invalidKeys.length > 0) {
    throw new Error(
      `${funcName} expects the '${argName}' argument to be an object whose values are ${type}s. These keys have values with invalid types: '${invalidKeys.join(
        "', '"
      )}'`
    )
  }
}

function hasType(object, type, optional) {
  if (optional && typeof object === 'undefined') {
    return true
  }

  if (type === 'object') {
    return isPlainObject(object)
  }

  if (type === 'array') {
    return Array.isArray(object)
  }

  return typeof object === type // eslint-disable-line valid-typeof
}

function outputType(type) {
  return type === 'object' || type === 'array' ? `an ${type}` : `a ${type}`
}
