// @vitest-environment jsdom
/**
 * ui-session-pin browser half: the pinned board — rendered through the
 * sections hole against the real SlotRegistry. Covers row derivation
 * (workspace label, ungrouped, archived, vanished sessions), open/unpin
 * interactions, collapse, the auto-follow reorder, and HMR-safe removal.
 */
import { cleanup, fireEvent, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { SlotTestRuntime } from '@deepseek-ai/dsh-client-test-runtime'
import type { WorkspaceView } from '@deepseek-ai/dsh-api-workspace-controller/client'
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
const SID2 = 'session-2' as SessionId
const OTHER = 'session-3' as SessionId
const UNGROUPED = 'session-4' as SessionId

function workspace(id: string, title: string, sessionIds: SessionId[]): WorkspaceView {
  return { workspaceId: id, title, path: `/${id}`, sessionIds } as unknown as WorkspaceView
}

async function sectionRuntime(): Promise<{
  runtime: SlotTestRuntime
  handle: { dispose: () => Promise<void> }
  view: ReturnType<SlotTestRuntime['renderSlot']>
  moveWorkspaceToTop: ReturnType<typeof vi.fn>
  open: ReturnType<typeof vi.fn>
  pin: (...ids: string[]) => Promise<void>
}> {
  const runtime = await SlotTestRuntime.create()
  const locale = new LocaleRuntime(runtime.ctx)
  runtime.ctx.provide('locale', locale)
  runtime.slots.installLocale(locale)
  await runtime.workspaces.update((d) => {
    d.items = [
      workspace('ws-1', 'Work', [SID]),
      workspace('ws-2', 'Play', [OTHER, SID2]),
    ]
    d.archivedSessionIds = []
  })
  for (const [id, title, current] of [
    [SID, 'S1', true],
    [SID2, 'S2', false],
    [OTHER, 'S3', false],
    [UNGROUPED, 'S4', false],
  ] as const) {
    await runtime.sessions.add({
      id,
      summary: { title, displayTitle: title, cwd: '/w' },
      session: {},
    }, { current })
  }
  await runtime.declare({
    'sidebar.workspaces.sections': { kind: 'list', scope: 'root' },
  })
  const handle = await runtime.mount({ inject: [...inject], apply })
  const moveWorkspaceToTop = vi.fn()
  const view = runtime.renderSlot('sidebar.workspaces.sections', { moveWorkspaceToTop })
  const open = vi.spyOn(runtime.sessions, 'open')
  const pin = async (...ids: string[]): Promise<void> => {
    const store = runtime.storeOf('sidebar.workspaces.sections') as unknown as {
      actions: { togglePin: (sessionId: string) => void }
    }
    for (const id of ids) store.actions.togglePin(id)
    await runtime.flush()
  }
  return { runtime, handle, view, moveWorkspaceToTop, open, pin }
}

describe('PinnedSection (sidebar.workspaces.sections)', () => {
  it('renders the header and the empty hint while nothing is pinned', async () => {
    const { view } = await sectionRuntime()
    expect(view.view.getByText(en['section.title'])).toBeTruthy()
    expect(view.view.getByText(en['section.empty'])).toBeTruthy()
  })

  it('lists pinned sessions most-recent-first with their workspace label, opens and unpins', async () => {
    const { view, open, pin } = await sectionRuntime()
    await pin(SID, OTHER)
    expect(view.view.getByText('Work')).toBeTruthy()
    expect(view.view.getByText('Play')).toBeTruthy()
    // Most recently pinned first: S3 row before S1 row.
    const rows = within(view.container).getAllByRole('button')
      .filter(el => el.getAttribute('aria-label')?.startsWith('Open session'))
    expect(rows.map(el => el.getAttribute('aria-label'))).toEqual([
      en['open.aria'].replace('{name}', 'S3'),
      en['open.aria'].replace('{name}', 'S1'),
    ])

    fireEvent.click(within(view.container).getByRole('button', { name: en['open.aria'].replace('{name}', 'S1') }))
    expect(open).toHaveBeenCalledWith(SID)

    fireEvent.click(within(view.container).getByRole('button', { name: en['unpin.aria'].replace('{name}', 'S1') }))
    expect(view.view.queryByText('Work')).toBeNull()
    expect(view.view.getByText('Play')).toBeTruthy()
  })

  it('labels an ungrouped pin and hides archived or vanished pins', async () => {
    const { runtime, view, pin } = await sectionRuntime()
    await pin(UNGROUPED, SID, 'ghost')
    expect(view.view.getByText(en['workspace.ungrouped'])).toBeTruthy()
    // The vanished 'ghost' id yields no row: exactly the two resolvable pins.
    const rows = within(view.container).getAllByRole('button')
      .filter(el => el.getAttribute('aria-label')?.startsWith('Open session'))
    expect(rows).toHaveLength(2)

    await runtime.workspaces.update((d) => { d.archivedSessionIds = [SID] })
    expect(within(view.container).queryByRole('button', { name: en['open.aria'].replace('{name}', 'S1') })).toBeNull()
  })

  it('opens a pinned row with Enter and Space', async () => {
    const { view, open, pin } = await sectionRuntime()
    await pin(SID)
    const row = view.view.getByRole('button', { name: en['open.aria'].replace('{name}', 'S1') })
    fireEvent.keyDown(row, { key: 'x' })
    expect(open).not.toHaveBeenCalled()
    fireEvent.keyDown(row, { key: 'Enter' })
    expect(open).toHaveBeenCalledWith(SID)
    fireEvent.keyDown(row, { key: ' ' })
    expect(open).toHaveBeenCalledTimes(2)
  })

  it('collapses and expands the board', async () => {
    const { view, pin } = await sectionRuntime()
    await pin(SID)
    expect(view.view.getByRole('button', { name: en['collapse'] }).getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(view.view.getByRole('button', { name: en['collapse'] }))
    expect(view.view.queryByRole('button', { name: en['open.aria'].replace('{name}', 'S1') })).toBeNull()
    expect(view.view.getByRole('button', { name: en['expand'] }).getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(view.view.getByRole('button', { name: en['expand'] }))
    expect(view.view.getByRole('button', { name: en['open.aria'].replace('{name}', 'S1') })).toBeTruthy()
  })

  it('follows the current session’s group only while auto-follow is on', async () => {
    const { runtime, view, moveWorkspaceToTop } = await sectionRuntime()
    // Off by default: selection changes never reorder.
    await runtime.sessions.setCurrent(OTHER)
    expect(moveWorkspaceToTop).not.toHaveBeenCalled()

    fireEvent.click(view.view.getByRole('button', { name: en['autoFollow'] }))
    // Enabling follows the already-current session's group once.
    expect(moveWorkspaceToTop).toHaveBeenCalledTimes(1)
    expect(moveWorkspaceToTop).toHaveBeenLastCalledWith('ws-2')

    // Another session of the same group: already at rest, no repeat call.
    await runtime.sessions.setCurrent(SID2)
    expect(moveWorkspaceToTop).toHaveBeenCalledTimes(1)
    // A different group follows; the ungrouped bucket never moves.
    await runtime.sessions.setCurrent(SID)
    expect(moveWorkspaceToTop).toHaveBeenCalledTimes(2)
    expect(moveWorkspaceToTop).toHaveBeenLastCalledWith('ws-1')
    await runtime.sessions.setCurrent(UNGROUPED)
    expect(moveWorkspaceToTop).toHaveBeenCalledTimes(2)

    // Off again: no further reorders.
    fireEvent.click(view.view.getByRole('button', { name: en['autoFollow'] }))
    await runtime.sessions.setCurrent(OTHER)
    expect(moveWorkspaceToTop).toHaveBeenCalledTimes(2)
  })

  it('leaves the ledger when the fiber disposes', async () => {
    const { runtime, handle } = await sectionRuntime()
    expect(runtime.slots.entries('sidebar.workspaces.sections')).toHaveLength(1)
    await handle.dispose()
    expect(runtime.slots.entries('sidebar.workspaces.sections')).toEqual([])
  })
})
