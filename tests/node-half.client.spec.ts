/** Node half of the session-pin plugin: the Loader-facing no-op apply. */
import { describe, expect, it } from 'vitest'
import { apply } from '../src/index.ts'

describe('ui-session-pin node half', () => {
  it('applies as a no-op (the Loader requires the export)', () => {
    expect(apply()).toBeUndefined()
  })
})
