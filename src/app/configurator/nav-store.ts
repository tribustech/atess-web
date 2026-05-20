export type NavState = {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
};

export type NavSnapshot = {
  hasNext: boolean;
  hasBack: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
};

const EMPTY_STATE: NavState = {};
const EMPTY_SNAPSHOT: NavSnapshot = {
  hasNext: false,
  hasBack: false,
};

let state: NavState = EMPTY_STATE;
let snapshot: NavSnapshot = EMPTY_SNAPSHOT;
const listeners = new Set<() => void>();

function buildSnapshot(s: NavState): NavSnapshot {
  return {
    hasNext: Boolean(s.onNext),
    hasBack: Boolean(s.onBack),
    nextLabel: s.nextLabel,
    nextDisabled: s.nextDisabled,
    hideBack: s.hideBack,
  };
}

function snapshotsEqual(a: NavSnapshot, b: NavSnapshot): boolean {
  return (
    a.hasNext === b.hasNext &&
    a.hasBack === b.hasBack &&
    a.nextLabel === b.nextLabel &&
    a.nextDisabled === b.nextDisabled &&
    a.hideBack === b.hideBack
  );
}

export const navStore = {
  /** Latest handlers — always read fresh at click time. */
  current(): NavState {
    return state;
  },
  /** Stable snapshot for useSyncExternalStore — only changes on display fields. */
  getSnapshot(): NavSnapshot {
    return snapshot;
  },
  set(next: NavState): void {
    state = next;
    const nextSnapshot = buildSnapshot(next);
    if (!snapshotsEqual(snapshot, nextSnapshot)) {
      snapshot = nextSnapshot;
      for (const l of listeners) l();
    }
  },
  clear(): void {
    if (state === EMPTY_STATE) return;
    state = EMPTY_STATE;
    if (!snapshotsEqual(snapshot, EMPTY_SNAPSHOT)) {
      snapshot = EMPTY_SNAPSHOT;
      for (const l of listeners) l();
    }
  },
  subscribe(l: () => void): () => void {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
