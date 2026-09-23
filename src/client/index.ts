/**
 * Session-pin plugin, browser half. Two registrations into the workspace
 * browser's additive holes: the pinned board fills
 * `sidebar.workspaces.sections`, and the per-row pin toggle fills
 * `sidebar.workspaces.sessionActions`. Both share one pin store handle
 * created here in apply (module-level handles are forbidden). Remove this
 * plugin from the composition and both surfaces render empty at zero cost.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { ISessions } from '@deepseek-ai/dsh-api-session-controller/client'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
// Type-only: pulls the Controller service merges (ctx.sessions / ctx.workspaces).
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { PinInjected } from './PinnedSection.tsx'
import type { SessionPinKey } from './locales.ts'
import { en, zh } from './locales.ts'
import { PinnedSection } from './PinnedSection.tsx'
import { PinRowAction } from './PinRowAction.tsx'
import { createPinStore } from './stores.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Pinned board and row pin-toggle copy. */
    'sessionPin': SessionPinKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'sessionPin'

/**
 * Required services (cordis fiber inject). The target slots are declared by
 * the ui-workspace entry, whose activation order relative to this one is NOT
 * constrained: apply depends on each slot declaration through
 * `slots.inject()` instead of assuming order.
 */
export const inject = ['slots', 'locale', 'sessions']

/**
 * Register the pinned board and the row pin toggle once their slot
 * declarations are on the ledger.
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  const sessions = ctx.get('sessions') as ISessions
  const store = createPinStore()
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-session-pin: dictionaries')
  const injected = (): PinInjected => ({
    open: (sessionId: SessionId) => { sessions.open(sessionId) },
  })

  ctx.slots.inject('sidebar.workspaces.sections', () => ctx.slots.register(
    {
      name: 'sidebar.workspaces.sections',
      id: 'session-pin',
      store,
      inject: injected,
      locale: NS,
    },
    PinnedSection,
  ))
  ctx.slots.inject('sidebar.workspaces.sessionActions', () => ctx.slots.register(
    {
      name: 'sidebar.workspaces.sessionActions',
      id: 'session-pin',
      store,
      locale: NS,
    },
    PinRowAction,
  ))
}
