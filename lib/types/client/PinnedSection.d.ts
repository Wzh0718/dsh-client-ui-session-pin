import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { createPinStore } from './stores.ts';
/** Injected share: the Host-backed session open action. */
export type PinInjected = {
    /** Open a real Session. */
    open: (sessionId: SessionId) => void;
};
/** Full pinned-section props: runtime share + pin store + inject face + the locale seat. */
export type PinnedSectionProps = PropsRuntime<'sidebar.workspaces.sections'> & PropsStore<ReturnType<typeof createPinStore>> & PinInjected & PropsLocale<'sessionPin'>;
/**
 * Render the pinned board.
 * @param props - composed slot props (owner share + pin store + inject face + locale).
 * @returns the section element, or null while no pin state exists yet.
 */
export declare function PinnedSection({ useSessions, useWorkspaces, useStore, actions, open, moveWorkspaceToTop, t, }: PinnedSectionProps): import("react").JSX.Element;
//# sourceMappingURL=PinnedSection.d.ts.map