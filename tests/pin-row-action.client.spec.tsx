// @vitest-environment jsdom
/**
 * ui-session-pin browser half: the session-row pin toggle — rendered through
 * the sessionActions hole against the real SlotRegistry, driven through the
 * declared store, and removed with the fiber (HMR safety).
 */
import { cleanup, fireEvent, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { SlotTestRuntime } from '@deepseek-ai/dsh-client-test-runtime'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { apply, inject } from '../src/client/index.ts'
import { en } from '../src/client/locales.ts'

afterEach(() => {
  // The pin store persists to localStorage; jsdom shares it per file.
  window.localStorage.clear()
  cleanup()
  vi.restoreAllMocks()
})

const SID = 'session-1' as SessionId

async function rowRuntime(): Promise<{
  runtime: SlotTestRuntime
  handle: { dispose: () => Promise<void> }
  view: ReturnType<SlotTestRuntime['renderSlot']>
}> {
  const runtime = await SlotTestRuntime.create()
  const locale = new LocaleRuntime(runtime.ctx)
  runtime.ctx.provide('locale', locale)
  runtime.slots.installLocale(locale)
  await runtime.declare({
    'sidebar.workspaces.sessionActions': { kind: 'list', scope: 'root' },
  })
  const handle = await runtime.mount({ inject: [...inject], apply })
  const view = runtime.renderSlot('sidebar.workspaces.sessionActions', {
    session: { id: SID, title: 'S1', blank: false },
  })
  return { runtime, handle, view }
}

describe('PinRowAction (sidebar.workspaces.sessionActions)', () => {
  it('toggles the pin through the declared store', async () => {
    const { runtime, view } = await rowRuntime()
    const button = view.view.getByRole('button', { name: en['pin.aria'].replace('{name}', 'S1') })
    expect(button.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(button)
    expect(runtime.storeOf('sidebar.workspaces.sessionActions').getSnapshot()).toMatchObject({ pinned: [SID] })
    expect(within(view.container).getByRole('button', { name: en['unpin.aria'].replace('{name}', 'S1') })
      .getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(within(view.container).getByRole('button', { name: en['unpin.aria'].replace('{name}', 'S1') }))
    expect(runtime.storeOf('sidebar.workspaces.sessionActions').getSnapshot()).toMatchObject({ pinned: [] })
    expect(within(view.container).getByRole('button', { name: en['pin.aria'].replace('{name}', 'S1') })
      .getAttribute('aria-pressed')).toBe('false')
  })

  it('leaves the ledger when the fiber disposes', async () => {
    const { runtime, handle } = await rowRuntime()
    expect(runtime.slots.entries('sidebar.workspaces.sessionActions')).toHaveLength(1)
    await handle.dispose()
    expect(runtime.slots.entries('sidebar.workspaces.sessionActions')).toEqual([])
  })
})
