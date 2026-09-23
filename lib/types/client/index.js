import { en, zh } from "./locales.js";
import { PinnedSection } from "./PinnedSection.js";
import { PinRowAction } from "./PinRowAction.js";
import { createPinStore } from "./stores.js";
/** Dictionary namespace owned by this plugin. */
const NS = 'sessionPin';
/**
 * Required services (cordis fiber inject). The target slots are declared by
 * the ui-workspace entry, whose activation order relative to this one is NOT
 * constrained: apply depends on each slot declaration through
 * `slots.inject()` instead of assuming order.
 */
export const inject = ['slots', 'locale', 'sessions'];
/**
 * Register the pinned board and the row pin toggle once their slot
 * declarations are on the ledger.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    const sessions = ctx.get('sessions');
    const store = createPinStore();
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-session-pin: dictionaries');
    const injected = () => ({
        open: (sessionId) => { sessions.open(sessionId); },
    });
    ctx.slots.inject('sidebar.workspaces.sections', () => ctx.slots.register({
        name: 'sidebar.workspaces.sections',
        id: 'session-pin',
        store,
        inject: injected,
        locale: NS,
    }, PinnedSection));
    ctx.slots.inject('sidebar.workspaces.sessionActions', () => ctx.slots.register({
        name: 'sidebar.workspaces.sessionActions',
        id: 'session-pin',
        store,
        locale: NS,
    }, PinRowAction));
}
//# sourceMappingURL=index.js.map