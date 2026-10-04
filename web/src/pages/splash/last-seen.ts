import { sessionStorage } from "../../framework/session-storage";

const KEY = "SPLASH_LAST_SEEN_AT";

type Setter = typeof sessionStorage.set;
type Clock = { now: () => number };

export const setLastSeenWith = (set: Setter) => (clock: Clock) => (): void => {
  set(KEY, String(clock.now()));
};

type Finder = typeof sessionStorage.find;

export const checkIsSeenWith = (finder: Finder) => (): boolean => {
  return finder(KEY) !== undefined;
};

export const setLastSeen = setLastSeenWith(sessionStorage.set)(Date);
export const checkIsSeen = checkIsSeenWith(sessionStorage.find);
