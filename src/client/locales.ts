/**
 * `sessionPin` namespace dictionaries: the pinned section (header, rows,
 * auto-follow toggle) and the session-row pin control.
 */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'section.title': '已置顶',
  'section.empty': '在会话行上点击图钉即可置顶',
  'pin': '置顶',
  'unpin': '取消置顶',
  'pin.aria': '置顶会话“{name}”',
  'unpin.aria': '取消置顶会话“{name}”',
  'open.aria': '打开会话“{name}”',
  'autoFollow': '自动跟随当前会话的分组',
  'autoFollow.on': '已开启：当前会话所在分组自动移到顶部',
  'autoFollow.off': '已关闭自动跟随',
  'expand': '展开置顶区',
  'collapse': '收起置顶区',
  'workspace.ungrouped': '未分组',
} satisfies Record<string, string>

/** The sessionPin namespace key union. */
export type SessionPinKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'section.title': 'Pinned',
  'section.empty': 'Pin a session from its row action',
  'pin': 'Pin',
  'unpin': 'Unpin',
  'pin.aria': 'Pin session {name}',
  'unpin.aria': 'Unpin session {name}',
  'open.aria': 'Open session {name}',
  'autoFollow': 'Follow the current session’s group',
  'autoFollow.on': 'On: the current session’s group moves to the top',
  'autoFollow.off': 'Auto-follow is off',
  'expand': 'Expand the pinned section',
  'collapse': 'Collapse the pinned section',
  'workspace.ungrouped': 'Ungrouped',
} satisfies Record<SessionPinKey, string>
