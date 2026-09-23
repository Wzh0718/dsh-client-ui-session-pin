import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { createPinStore } from './stores.ts';
/** Full pin-control props: owner share (the row's session facts) + pin store + the locale seat. */
export type PinRowActionProps = PropsRuntime<'sidebar.workspaces.sessionActions'> & PropsStore<ReturnType<typeof createPinStore>> & PropsLocale<'sessionPin'>;
/**
 * Render the pin toggle for one session row.
 * @param props - composed slot props (owner share + pin store + locale).
 * @returns the toggle button.
 */
export declare function PinRowAction({ session, useStore, actions, t }: PinRowActionProps): import("react").JSX.Element;
//# sourceMappingURL=PinRowAction.d.ts.map