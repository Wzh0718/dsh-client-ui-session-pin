import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The pinned section: a collapsible board above the session tree listing
 * pinned Sessions (most recently pinned first) with their owning Workspace
 * label, plus the auto-follow toggle that keeps the current Session's
 * Workspace group at the top of the group order. Pure presentational — all
 * data and callbacks arrive through the props shares.
 */
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { IconChevronDownOutline14, IconPinFill16, IconToTopOutline16, Tooltip, } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './PinnedSection.module.css';
/**
 * Render the pinned board.
 * @param props - composed slot props (owner share + pin store + inject face + locale).
 * @returns the section element, or null while no pin state exists yet.
 */
export function PinnedSection({ useSessions, useWorkspaces, useStore, actions, open, moveWorkspaceToTop, t, }) {
    const pinned = useStore(s => s.pinned);
    const autoFollow = useStore(s => s.autoFollow);
    const [collapsed, setCollapsed] = useState(false);
    const byId = useSessions(s => s.byId);
    const current = useSessions(s => s.current);
    const workspaces = useWorkspaces(s => s.items);
    const archived = useWorkspaces(s => s.archivedSessionIds);
    // Auto-follow: one reorder per (current session → owning Workspace) change.
    // The ungrouped bucket has no Host account and never moves; a repeated
    // follow of the same Workspace is already at rest after the first call.
    const followed = useRef(undefined);
    useEffect(() => {
        if (!autoFollow || current === undefined)
            return;
        const owner = workspaces.find(workspace => workspace.sessionIds.includes(current));
        if (owner === undefined)
            return;
        const key = owner.workspaceId;
        if (followed.current === key)
            return;
        followed.current = key;
        moveWorkspaceToTop(owner.workspaceId);
    }, [autoFollow, current, workspaces, moveWorkspaceToTop]);
    const rows = pinned.flatMap((id) => {
        const sessionId = id;
        const summary = byId[sessionId];
        if (summary === undefined || archived.includes(sessionId))
            return [];
        const owner = workspaces.find(workspace => workspace.sessionIds.includes(sessionId));
        return [{
                id: sessionId,
                title: summary.displayTitle,
                workspace: owner?.title ?? t('workspace.ungrouped'),
            }];
    });
    return (_jsxs("section", { className: css.pinnedSection, "aria-label": t('section.title'), children: [_jsxs("div", { className: css.headerRow, children: [_jsx("button", { type: "button", className: css.collapseButton, "aria-label": collapsed ? t('expand') : t('collapse'), "aria-expanded": !collapsed, onClick: () => { setCollapsed(v => !v); }, children: _jsx(IconChevronDownOutline14, { className: clsx(css.chevron, collapsed && css.collapsed) }) }), _jsx("span", { className: css.headerIcon, children: _jsx(IconPinFill16, {}) }), _jsx("span", { className: css.headerTitle, children: t('section.title') }), _jsx(Tooltip, { label: autoFollow ? t('autoFollow.on') : t('autoFollow.off'), side: "top", children: _jsx("button", { type: "button", className: clsx(css.followButton, autoFollow && css.followActive), "aria-label": t('autoFollow'), "aria-pressed": autoFollow, onClick: () => { actions.setAutoFollow(!autoFollow); }, children: _jsx(IconToTopOutline16, {}) }) })] }), !collapsed && (rows.length === 0
                ? _jsx("div", { className: css.empty, children: t('section.empty') })
                : rows.map(row => (_jsxs("div", { className: css.pinnedRow, role: "button", tabIndex: 0, "aria-label": t('open.aria', { name: row.title }), onClick: () => { open(row.id); }, onKeyDown: (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            open(row.id);
                        }
                    }, children: [_jsx("span", { className: css.rowTitle, children: row.title }), _jsx("span", { className: css.rowWorkspace, children: row.workspace }), _jsx("button", { type: "button", className: css.unpinButton, "aria-label": t('unpin.aria', { name: row.title }), onClick: (e) => {
                                e.stopPropagation();
                                actions.unpin(row.id);
                            }, children: _jsx(IconPinFill16, {}) })] }, row.id))))] }));
}
//# sourceMappingURL=PinnedSection.js.map