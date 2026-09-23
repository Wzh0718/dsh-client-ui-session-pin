/**
 * The pin store: pinned Session ids in pin order plus the auto-follow flag,
 * persisted across reloads. Module level exports the factory only (a
 * module-level handle would pin the store identity across plugin reloads).
 */
import { defineStore } from '@deepseek-ai/dsh-client-store';
/**
 * Create the pin store handle.
 * @returns the store handle (spec + type + identity + factory in one).
 */
export function createPinStore() {
    return defineStore({
        init: () => ({ pinned: [], autoFollow: false }),
        persist: 'dsh.sessionPin.v1',
        actions: {
            togglePin: (d, sessionId) => {
                d.pinned = d.pinned.includes(sessionId)
                    ? d.pinned.filter(id => id !== sessionId)
                    : [sessionId, ...d.pinned];
            },
            unpin: (d, sessionId) => {
                d.pinned = d.pinned.filter(id => id !== sessionId);
            },
            setAutoFollow: (d, on) => { d.autoFollow = on; },
        },
    });
}
//# sourceMappingURL=stores.js.map