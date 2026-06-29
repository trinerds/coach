function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function* serializeBufferJson(value: Buffer): Generator<string> {
  yield '{"type":"Buffer","data":['

  for (let index = 0; index < value.length; index++) {
    if (index > 0) {
      yield ','
    }

    yield String(value[index])
  }

  yield ']}'
}

function* serializeUint8ArrayJson(value: Uint8Array): Generator<string> {
  yield '{"type":"Buffer","data":['

  for (let index = 0; index < value.length; index++) {
    if (index > 0) {
      yield ','
    }

    yield String(value[index])
  }

  yield ']}'
}

export function* serializeJsonChunks(value: unknown, inArray = false): Generator<string> {
  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') {
    if (inArray) {
      yield 'null'
    }

    return
  }

  if (value === null || typeof value !== 'object') {
    yield JSON.stringify(value)
    return
  }

  if (Buffer.isBuffer(value)) {
    yield* serializeBufferJson(value)
    return
  }

  if (value instanceof Uint8Array) {
    yield* serializeUint8ArrayJson(value)
    return
  }

  if (Array.isArray(value)) {
    yield '['

    for (const [index, item] of value.entries()) {
      if (index > 0) {
        yield ','
      }

      yield* serializeJsonChunks(item, true)
    }

    yield ']'
    return
  }

  if (value instanceof Date) {
    yield JSON.stringify(value)
    return
  }

  if (!isPlainObject(value) && typeof (value as { toJSON?: () => unknown }).toJSON === 'function') {
    yield* serializeJsonChunks((value as { toJSON: () => unknown }).toJSON(), inArray)
    return
  }

  yield '{'

  let isFirstProperty = true

  for (const key of Object.keys(value)) {
    const propertyValue = (value as Record<string, unknown>)[key]

    if (propertyValue === undefined || typeof propertyValue === 'function') {
      continue
    }

    if (!isFirstProperty) {
      yield ','
    }

    isFirstProperty = false
    yield JSON.stringify(key)
    yield ':'
    yield* serializeJsonChunks(propertyValue)
  }

  yield '}'
}

export async function* createJsonStreamFromSections(
  sections: Array<{ key: string; collect: () => Promise<unknown> }>
): AsyncGenerator<string> {
  yield '{'

  for (const [index, section] of sections.entries()) {
    if (index > 0) {
      yield ','
    }

    yield JSON.stringify(section.key)
    yield ':'
    yield* serializeJsonChunks(await section.collect())
  }

  yield '}'
}
