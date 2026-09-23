/**
 * The pin store: pinned Session ids in pin order plus the auto-follow flag,
 * persisted across reloads. Module level exports the factory only (a
 * module-level handle would pin the store identity across plugin reloads).
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-store'

/** Pin-board viewing state persisted across surface remounts and reloads. */
type PinState = {
  /** Pinned Session ids, most recently pinned first. */
  pinned: string[]
  /** Move the current Session's Workspace group to the top on selection change. */
  autoFollow: boolean
}

/**
 * Annotation twin of the actions literal below (the export needs a declared
 * return type); drift fails assignability at the defineStore call.
 */
type PinActions = {
  togglePin: (draft: PinState, sessionId: string) => void
  unpin: (draft: PinState, sessionId: string) => void
  setAutoFollow: (draft: PinState, on: boolean) => void
}

/**
 * Create the pin store handle.
 * @returns the store handle (spec + type + identity + factory in one).
 */
export function createPinStore(): EngineStoreHandle<PinState, PinActions> {
  return defineStore({
    init: (): PinState => ({ pinned: [], autoFollow: false }),
    persist: 'dsh.sessionPin.v1',
    actions: {
      togglePin: (d, sessionId) => {
        d.pinned = d.pinned.includes(sessionId)
          ? d.pinned.filter(id => id !== sessionId)
          : [sessionId, ...d.pinned]
      },
      unpin: (d, sessionId) => {
        d.pinned = d.pinned.filter(id => id !== sessionId)
      },
      setAutoFollow: (d, on) => { d.autoFollow = on },
    },
  })
}
