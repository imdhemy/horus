import { cookie } from "../../framework/cookies";

const KEY = "SPLASH_LAST_SEEN_AT";
const ONE_HOUR_SECONDS = 60 * 60;

type Setter = typeof cookie.set;
type Clock = { now: () => number };

export const setLastSeenWith = (set: Setter) => (clock: Clock) => (): void => {
  set(KEY, String(clock.now()), ONE_HOUR_SECONDS);
};

type Finder = typeof cookie.find;
type IsSeenResult = {
  ok: boolean;
};

export const checkIsSeenWith = (finder: Finder) => (): IsSeenResult => {
  return { ok: finder(KEY) !== undefined };
};

export const setLastSeen = setLastSeenWith(cookie.set)(Date);
export const checkIsSeen = checkIsSeenWith(cookie.find);
