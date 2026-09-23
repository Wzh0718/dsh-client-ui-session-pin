/**
 * The session-row pin control: one toggle inside the row's trailing actions
 * area (revealed with the built-in row menu). Pure presentational — the row's
 * session facts arrive as owner props, pin state through the declared store.
 */
import clsx from 'clsx'
import { IconPinFill16, IconPinOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pull the SlotMap merge (sessionActions owner props) into this program.
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import type { createPinStore } from './stores.ts'
import css from './PinRowAction.module.css'

/** Full pin-control props: owner share (the row's session facts) + pin store + the locale seat. */
export type PinRowActionProps =
  PropsRuntime<'sidebar.workspaces.sessionActions'>
  & PropsStore<ReturnType<typeof createPinStore>>
  & PropsLocale<'sessionPin'>

/**
 * Render the pin toggle for one session row.
 * @param props - composed slot props (owner share + pin store + locale).
 * @returns the toggle button.
 */
export function PinRowAction({ session, useStore, actions, t }: PinRowActionProps) {
  const pinned = useStore(s => s.pinned.includes(session.id as string))
  // The hole never renders for the provisional blank row, so the title is
  // always a stored display title here.
  return (
    <button
      type="button"
      className={clsx(css.pinButton, pinned && css.pinned)}
      aria-label={pinned ? t('unpin.aria', { name: session.title }) : t('pin.aria', { name: session.title })}
      aria-pressed={pinned}
      onClick={(e) => {
        e.stopPropagation()
        actions.togglePin(session.id as string)
      }}
    >
      {pinned ? <IconPinFill16 /> : <IconPinOutline16 />}
    </button>
  )
}
