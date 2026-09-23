// @vitest-environment jsdom
/**
 * The pin store: pin/unpin ordering, auto-follow flag, and the persisted
 * localStorage roundtrip (default off, wholesale rehydration).
 */
import { afterEach, describe, expect, it } from 'vitest'
import { createPinStore } from '../src/client/stores.ts'

afterEach(() => {
  window.localStorage.clear()
})

describe('createPinStore', () => {
  it('pins most-recent-first and toggles off', () => {
    const store = createPinStore().create()
    expect(store.getSnapshot()).toEqual({ pinned: [], autoFollow: false })
    store.actions.togglePin('one')
    store.actions.togglePin('two')
    expect(store.getSnapshot().pinned).toEqual(['two', 'one'])
    store.actions.togglePin('two')
    expect(store.getSnapshot().pinned).toEqual(['one'])
  })

  it('unpins idempotently and flips auto-follow', () => {
    const store = createPinStore().create()
    store.actions.togglePin('one')
    store.actions.unpin('one')
    store.actions.unpin('ghost')
    expect(store.getSnapshot().pinned).toEqual([])
    store.actions.setAutoFollow(true)
    expect(store.getSnapshot().autoFollow).toBe(true)
  })

  it('persists pinned ids and auto-follow across instances', () => {
    const first = createPinStore().create()
    first.actions.togglePin('one')
    first.actions.setAutoFollow(true)
    const second = createPinStore().create()
    expect(second.getSnapshot()).toEqual({ pinned: ['one'], autoFollow: true })
  })
})
