import { describe, expect, it } from 'vitest'

import {
  createJsonStreamFromSections,
  serializeJsonChunks
} from '../../../../server/utils/json-stream'

function readGenerator<T>(generator: Generator<T> | AsyncGenerator<T>): Promise<string> {
  return (async () => {
    let output = ''

    for await (const chunk of generator) {
      output += chunk
    }

    return output
  })()
}

describe('serializeJsonChunks', () => {
  it('serializes undefined array entries as null', async () => {
    const json = await readGenerator(serializeJsonChunks([1, undefined, 3]))

    expect(JSON.parse(json)).toEqual([1, null, 3])
  })

  it('streams Buffer data without using Buffer.toJSON()', async () => {
    const buffer = Buffer.from([0, 127, 255])
    const json = await readGenerator(serializeJsonChunks({ fileData: buffer }))

    expect(JSON.parse(json)).toEqual({
      fileData: { type: 'Buffer', data: [0, 127, 255] }
    })
    expect(json).toBe(JSON.stringify({ fileData: buffer }))
  })

  it('omits undefined object properties', async () => {
    const json = await readGenerator(serializeJsonChunks({ kept: 'yes', dropped: undefined }))

    expect(JSON.parse(json)).toEqual({ kept: 'yes' })
  })
})

describe('createJsonStreamFromSections', () => {
  it('builds a JSON object from ordered sections', async () => {
    const json = await readGenerator(
      createJsonStreamFromSections([
        { key: 'metadata', collect: async () => ({ version: '1.0.0' }) },
        { key: 'profile', collect: async () => ({ email: 'athlete@example.com' }) }
      ])
    )

    expect(JSON.parse(json)).toEqual({
      metadata: { version: '1.0.0' },
      profile: { email: 'athlete@example.com' }
    })
  })
})
