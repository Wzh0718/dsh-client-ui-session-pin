/**
 * Session-pin plugin, browser half. Two registrations into the workspace
 * browser's additive holes: the pinned board fills
 * `sidebar.workspaces.sections`, and the per-row pin toggle fills
 * `sidebar.workspaces.sessionActions`. Both share one pin store handle
 * created here in apply (module-level handles are forbidden). Remove this
 * plugin from the composition and both surfaces render empty at zero cost.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { SessionPinKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Pinned board and row pin-toggle copy. */
        'sessionPin': SessionPinKey;
    }
}
/**
 * Required services (cordis fiber inject). The target slots are declared by
 * the ui-workspace entry, whose activation order relative to this one is NOT
 * constrained: apply depends on each slot declaration through
 * `slots.inject()` instead of assuming order.
 */
export declare const inject: string[];
/**
 * Register the pinned board and the row pin toggle once their slot
 * declarations are on the ledger.
 * @param ctx - client root context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map