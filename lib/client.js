window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-session-pin",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		//#region src/client/locales.ts
		/**
		* `sessionPin` namespace dictionaries: the pinned section (header, rows,
		* auto-follow toggle) and the session-row pin control.
		*/
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"section.title": "已置顶",
			"section.empty": "在会话行上点击图钉即可置顶",
			"pin": "置顶",
			"unpin": "取消置顶",
			"pin.aria": "置顶会话“{name}”",
			"unpin.aria": "取消置顶会话“{name}”",
			"open.aria": "打开会话“{name}”",
			"autoFollow": "自动跟随当前会话的分组",
			"autoFollow.on": "已开启：当前会话所在分组自动移到顶部",
			"autoFollow.off": "已关闭自动跟随",
			"expand": "展开置顶区",
			"collapse": "收起置顶区",
			"workspace.ungrouped": "未分组"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"section.title": "Pinned",
			"section.empty": "Pin a session from its row action",
			"pin": "Pin",
			"unpin": "Unpin",
			"pin.aria": "Pin session {name}",
			"unpin.aria": "Unpin session {name}",
			"open.aria": "Open session {name}",
			"autoFollow": "Follow the current session’s group",
			"autoFollow.on": "On: the current session’s group moves to the top",
			"autoFollow.off": "Auto-follow is off",
			"expand": "Expand the pinned section",
			"collapse": "Collapse the pinned section",
			"workspace.ungrouped": "Ungrouped"
		};
		//#endregion
		//#region ../deepseek-harness/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region \0dsh-css:/home/libre/project/dsh-client-ui-session-pin/src/client/PinnedSection.module.css.mjs
		const css$1 = ".isfLYW_pinnedSection{flex-direction:column;flex:none;margin:0 8px 4px;display:flex}.isfLYW_headerRow{user-select:none;align-items:center;gap:6px;height:32px;padding:0 8px;display:flex}.isfLYW_headerIcon{width:16px;height:16px;color:var(--dsw-alias-label-secondary);flex:none;justify-content:center;align-items:center;display:inline-flex}.isfLYW_headerTitle{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary);flex:auto;font-size:14px;font-weight:500;line-height:20px;overflow:hidden}.isfLYW_collapseButton,.isfLYW_followButton,.isfLYW_unpinButton,.isfLYW_pinButton{cursor:pointer;width:16px;height:16px;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.isfLYW_collapseButton:hover,.isfLYW_followButton:hover,.isfLYW_unpinButton:hover,.isfLYW_pinButton:hover{color:var(--dsw-alias-label-primary)}.isfLYW_chevron{transition:transform var(--ds-transition-duration-fast) var(--ds-ease-in-out)}.isfLYW_collapsed{transform:rotate(-90deg)}.isfLYW_followActive{color:var(--dsw-alias-label-primary-bluish)}.isfLYW_empty{color:var(--dsw-alias-label-tertiary);padding:4px 8px 6px 30px;font-size:12px;line-height:17px}.isfLYW_pinnedRow{cursor:pointer;user-select:none;height:32px;color:var(--dsw-alias-label-primary);border-radius:8px;align-items:center;gap:6px;padding:0 8px;display:flex}.isfLYW_pinnedRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.isfLYW_rowTitle{text-overflow:ellipsis;white-space:nowrap;flex:0 auto;min-width:0;font-size:14px;line-height:20px;overflow:hidden}.isfLYW_rowWorkspace{text-overflow:ellipsis;white-space:nowrap;text-align:right;min-width:0;color:var(--dsw-alias-label-tertiary);flex:auto;font-size:12px;line-height:17px;overflow:hidden}.isfLYW_unpinButton{visibility:hidden}.isfLYW_pinnedRow:hover .isfLYW_unpinButton,.isfLYW_pinnedRow:focus-within .isfLYW_unpinButton{visibility:visible}";
		const tagId$1 = "@deepseek-ai/dsh-client-ui-session-pin/PinnedSection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-session-pin";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var PinnedSection_module_css_default = {
			"empty": "isfLYW_empty",
			"headerIcon": "isfLYW_headerIcon",
			"collapsed": "isfLYW_collapsed",
			"pinnedRow": "isfLYW_pinnedRow",
			"rowTitle": "isfLYW_rowTitle",
			"unpinButton": "isfLYW_unpinButton",
			"chevron": "isfLYW_chevron",
			"rowWorkspace": "isfLYW_rowWorkspace",
			"followButton": "isfLYW_followButton",
			"collapseButton": "isfLYW_collapseButton",
			"pinButton": "isfLYW_pinButton",
			"headerRow": "isfLYW_headerRow",
			"pinnedSection": "isfLYW_pinnedSection",
			"headerTitle": "isfLYW_headerTitle",
			"followActive": "isfLYW_followActive"
		};
		//#endregion
		//#region src/client/PinnedSection.tsx
		/**
		* The pinned section: a collapsible board above the session tree listing
		* pinned Sessions (most recently pinned first) with their owning Workspace
		* label, plus the auto-follow toggle that keeps the current Session's
		* Workspace group at the top of the group order. Pure presentational — all
		* data and callbacks arrive through the props shares.
		*/
		/**
		* Render the pinned board.
		* @param props - composed slot props (owner share + pin store + inject face + locale).
		* @returns the section element, or null while no pin state exists yet.
		*/
		function PinnedSection({ useSessions, useWorkspaces, useStore, actions, open, moveWorkspaceToTop, t }) {
			const pinned = useStore((s) => s.pinned);
			const autoFollow = useStore((s) => s.autoFollow);
			const [collapsed, setCollapsed] = (0, react.useState)(false);
			const byId = useSessions((s) => s.byId);
			const current = useSessions((s) => s.current);
			const workspaces = useWorkspaces((s) => s.items);
			const archived = useWorkspaces((s) => s.archivedSessionIds);
			const followed = (0, react.useRef)(void 0);
			(0, react.useEffect)(() => {
				if (!autoFollow || current === void 0) return;
				const owner = workspaces.find((workspace) => workspace.sessionIds.includes(current));
				if (owner === void 0) return;
				const key = owner.workspaceId;
				if (followed.current === key) return;
				followed.current = key;
				moveWorkspaceToTop(owner.workspaceId);
			}, [
				autoFollow,
				current,
				workspaces,
				moveWorkspaceToTop
			]);
			const rows = pinned.flatMap((id) => {
				const sessionId = id;
				const summary = byId[sessionId];
				if (summary === void 0 || archived.includes(sessionId)) return [];
				const owner = workspaces.find((workspace) => workspace.sessionIds.includes(sessionId));
				return [{
					id: sessionId,
					title: summary.displayTitle,
					workspace: owner?.title ?? t("workspace.ungrouped")
				}];
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: PinnedSection_module_css_default.pinnedSection,
				"aria-label": t("section.title"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: PinnedSection_module_css_default.headerRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: PinnedSection_module_css_default.collapseButton,
							"aria-label": collapsed ? t("expand") : t("collapse"),
							"aria-expanded": !collapsed,
							onClick: () => {
								setCollapsed((v) => !v);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { className: clsx(PinnedSection_module_css_default.chevron, collapsed && PinnedSection_module_css_default.collapsed) })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: PinnedSection_module_css_default.headerIcon,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinFill16, {})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: PinnedSection_module_css_default.headerTitle,
							children: t("section.title")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
							label: autoFollow ? t("autoFollow.on") : t("autoFollow.off"),
							side: "top",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: clsx(PinnedSection_module_css_default.followButton, autoFollow && PinnedSection_module_css_default.followActive),
								"aria-label": t("autoFollow"),
								"aria-pressed": autoFollow,
								onClick: () => {
									actions.setAutoFollow(!autoFollow);
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconToTopOutline16, {})
							})
						})
					]
				}), !collapsed && (rows.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: PinnedSection_module_css_default.empty,
					children: t("section.empty")
				}) : rows.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: PinnedSection_module_css_default.pinnedRow,
					role: "button",
					tabIndex: 0,
					"aria-label": t("open.aria", { name: row.title }),
					onClick: () => {
						open(row.id);
					},
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							open(row.id);
						}
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: PinnedSection_module_css_default.rowTitle,
							children: row.title
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: PinnedSection_module_css_default.rowWorkspace,
							children: row.workspace
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: PinnedSection_module_css_default.unpinButton,
							"aria-label": t("unpin.aria", { name: row.title }),
							onClick: (e) => {
								e.stopPropagation();
								actions.unpin(row.id);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinFill16, {})
						})
					]
				}, row.id)))]
			});
		}
		//#endregion
		//#region \0dsh-css:/home/libre/project/dsh-client-ui-session-pin/src/client/PinRowAction.module.css.mjs
		const css = ".-y7_pG_pinButton{cursor:pointer;width:16px;height:16px;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.-y7_pG_pinButton:hover{color:var(--dsw-alias-label-primary)}.-y7_pG_pinned{color:var(--dsw-alias-label-primary-bluish)}";
		const tagId = "@deepseek-ai/dsh-client-ui-session-pin/PinRowAction.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-session-pin";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var PinRowAction_module_css_default = {
			"pinned": "-y7_pG_pinned",
			"pinButton": "-y7_pG_pinButton"
		};
		//#endregion
		//#region src/client/PinRowAction.tsx
		/**
		* The session-row pin control: one toggle inside the row's trailing actions
		* area (revealed with the built-in row menu). Pure presentational — the row's
		* session facts arrive as owner props, pin state through the declared store.
		*/
		/**
		* Render the pin toggle for one session row.
		* @param props - composed slot props (owner share + pin store + locale).
		* @returns the toggle button.
		*/
		function PinRowAction({ session, useStore, actions, t }) {
			const pinned = useStore((s) => s.pinned.includes(session.id));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: clsx(PinRowAction_module_css_default.pinButton, pinned && PinRowAction_module_css_default.pinned),
				"aria-label": pinned ? t("unpin.aria", { name: session.title }) : t("pin.aria", { name: session.title }),
				"aria-pressed": pinned,
				onClick: (e) => {
					e.stopPropagation();
					actions.togglePin(session.id);
				},
				children: pinned ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinFill16, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPinOutline16, {})
			});
		}
		//#endregion
		//#region src/client/stores.ts
		/**
		* The pin store: pinned Session ids in pin order plus the auto-follow flag,
		* persisted across reloads. Module level exports the factory only (a
		* module-level handle would pin the store identity across plugin reloads).
		*/
		/**
		* Create the pin store handle.
		* @returns the store handle (spec + type + identity + factory in one).
		*/
		function createPinStore() {
			return (0, _deepseek_ai_dsh_client_store.defineStore)({
				init: () => ({
					pinned: [],
					autoFollow: false
				}),
				persist: "dsh.sessionPin.v1",
				actions: {
					togglePin: (d, sessionId) => {
						d.pinned = d.pinned.includes(sessionId) ? d.pinned.filter((id) => id !== sessionId) : [sessionId, ...d.pinned];
					},
					unpin: (d, sessionId) => {
						d.pinned = d.pinned.filter((id) => id !== sessionId);
					},
					setAutoFollow: (d, on) => {
						d.autoFollow = on;
					}
				}
			});
		}
		//#endregion
		//#region src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "sessionPin";
		/**
		* Required services (cordis fiber inject). The target slots are declared by
		* the ui-workspace entry, whose activation order relative to this one is NOT
		* constrained: apply depends on each slot declaration through
		* `slots.inject()` instead of assuming order.
		*/
		const inject = [
			"slots",
			"locale",
			"sessions"
		];
		/**
		* Register the pinned board and the row pin toggle once their slot
		* declarations are on the ledger.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const sessions = ctx.get("sessions");
			const store = createPinStore();
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-session-pin: dictionaries");
			const injected = () => ({ open: (sessionId) => {
				sessions.open(sessionId);
			} });
			ctx.slots.inject("sidebar.workspaces.sections", () => ctx.slots.register({
				name: "sidebar.workspaces.sections",
				id: "session-pin",
				store,
				inject: injected,
				locale: NS
			}, PinnedSection));
			ctx.slots.inject("sidebar.workspaces.sessionActions", () => ctx.slots.register({
				name: "sidebar.workspaces.sessionActions",
				id: "session-pin",
				store,
				locale: NS
			}, PinRowAction));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map