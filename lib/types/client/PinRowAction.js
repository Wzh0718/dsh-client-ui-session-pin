import { jsx as _jsx } from "react/jsx-runtime";
/**
 * The session-row pin control: one toggle inside the row's trailing actions
 * area (revealed with the built-in row menu). Pure presentational — the row's
 * session facts arrive as owner props, pin state through the declared store.
 */
import clsx from 'clsx';
import { IconPinFill16, IconPinOutline16 } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './PinRowAction.module.css';
/**
 * Render the pin toggle for one session row.
 * @param props - composed slot props (owner share + pin store + locale).
 * @returns the toggle button.
 */
export function PinRowAction({ session, useStore, actions, t }) {
    const pinned = useStore(s => s.pinned.includes(session.id));
    // The hole never renders for the provisional blank row, so the title is
    // always a stored display title here.
    return (_jsx("button", { type: "button", className: clsx(css.pinButton, pinned && css.pinned), "aria-label": pinned ? t('unpin.aria', { name: session.title }) : t('pin.aria', { name: session.title }), "aria-pressed": pinned, onClick: (e) => {
            e.stopPropagation();
            actions.togglePin(session.id);
        }, children: pinned ? _jsx(IconPinFill16, {}) : _jsx(IconPinOutline16, {}) }));
}
//# sourceMappingURL=PinRowAction.js.map