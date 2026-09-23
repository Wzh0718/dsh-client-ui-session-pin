/**
 * The pinned section: a collapsible board above the session tree listing
 * pinned Sessions (most recently pinned first) with their owning Workspace
 * label, plus the auto-follow toggle that keeps the current Session's
 * Workspace group at the top of the group order. Pure presentational — all
 * data and callbacks arrive through the props shares.
 */
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import {
  IconChevronDownOutline14, IconPinFill16, IconToTopOutline16, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pull the SlotMap merge (sections owner props) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
// Type-only: pull the Session standard-hook merge into this program.
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { createPinStore } from './stores.ts'
import css from './PinnedSection.module.css'

/** Injected share: the Host-backed session open action. */
export type PinInjected = {
  /** Open a real Session. */
  open: (sessionId: SessionId) => void
}

/** Full pinned-section props: runtime share + pin store + inject face + the locale seat. */
export type PinnedSectionProps =
  PropsRuntime<'sidebar.workspaces.sections'>
  & PropsStore<ReturnType<typeof createPinStore>>
  & PinInjected
  & PropsLocale<'sessionPin'>

/** One resolvable pinned row. */
interface PinnedRow {
  id: SessionId
  title: string
  workspace: string
}

/**
 * Render the pinned board.
 * @param props - composed slot props (owner share + pin store + inject face + locale).
 * @returns the section element, or null while no pin state exists yet.
 */
export function PinnedSection({
  useSessions, useWorkspaces, useStore, actions, open, moveWorkspaceToTop, t,
}: PinnedSectionProps) {
  const pinned = useStore(s => s.pinned)
  const autoFollow = useStore(s => s.autoFollow)
  const [collapsed, setCollapsed] = useState(false)
  const byId = useSessions(s => s.byId)
  const current = useSessions(s => s.current)
  const workspaces = useWorkspaces(s => s.items)
  const archived = useWorkspaces(s => s.archivedSessionIds)

  // Auto-follow: one reorder per (current session → owning Workspace) change.
  // The ungrouped bucket has no Host account and never moves; a repeated
  // follow of the same Workspace is already at rest after the first call.
  const followed = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (!autoFollow || current === undefined) return
    const owner = workspaces.find(workspace => workspace.sessionIds.includes(current))
    if (owner === undefined) return
    const key = owner.workspaceId as string
    if (followed.current === key) return
    followed.current = key
    moveWorkspaceToTop(owner.workspaceId)
  }, [autoFollow, current, workspaces, moveWorkspaceToTop])

  const rows: PinnedRow[] = pinned.flatMap((id) => {
    const sessionId = id as SessionId
    const summary = byId[sessionId]
    if (summary === undefined || archived.includes(sessionId)) return []
    const owner = workspaces.find(workspace => workspace.sessionIds.includes(sessionId))
    return [{
      id: sessionId,
      title: summary.displayTitle,
      workspace: owner?.title ?? t('workspace.ungrouped'),
    }]
  })

  return (
    <section className={css.pinnedSection} aria-label={t('section.title')}>
      <div className={css.headerRow}>
        <button
          type="button"
          className={css.collapseButton}
          aria-label={collapsed ? t('expand') : t('collapse')}
          aria-expanded={!collapsed}
          onClick={() => { setCollapsed(v => !v) }}
        >
          <IconChevronDownOutline14 className={clsx(css.chevron, collapsed && css.collapsed)} />
        </button>
        <span className={css.headerIcon}><IconPinFill16 /></span>
        <span className={css.headerTitle}>{t('section.title')}</span>
        <Tooltip label={autoFollow ? t('autoFollow.on') : t('autoFollow.off')} side="top">
          <button
            type="button"
            className={clsx(css.followButton, autoFollow && css.followActive)}
            aria-label={t('autoFollow')}
            aria-pressed={autoFollow}
            onClick={() => { actions.setAutoFollow(!autoFollow) }}
          >
            <IconToTopOutline16 />
          </button>
        </Tooltip>
      </div>
      {!collapsed && (rows.length === 0
        ? <div className={css.empty}>{t('section.empty')}</div>
        : rows.map(row => (
          <div
            key={row.id}
            className={css.pinnedRow}
            role="button"
            tabIndex={0}
            aria-label={t('open.aria', { name: row.title })}
            onClick={() => { open(row.id) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                open(row.id)
              }
            }}
          >
            <span className={css.rowTitle}>{row.title}</span>
            <span className={css.rowWorkspace}>{row.workspace}</span>
            <button
              type="button"
              className={css.unpinButton}
              aria-label={t('unpin.aria', { name: row.title })}
              onClick={(e) => {
                e.stopPropagation()
                actions.unpin(row.id as string)
              }}
            >
              <IconPinFill16 />
            </button>
          </div>
        )))}
    </section>
  )
}
