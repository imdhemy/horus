import { find, set } from "../../framework/local-storage";

const KEY = "SPLASH_LAST_SEEN_AT";
const ONE_HOUR_MILLIS = 60 * 60 * 1000;

type Setter = typeof set;
type SetResult = {
  expiresAt: number;
};

export const setLastSeenWith = (set: Setter) => (): SetResult => {
  return set(KEY, "", ONE_HOUR_MILLIS);
};

type Finder = typeof find;
type IsSeenResult = {
  ok: boolean;
};

export const checkIsSeenWith = (finder: Finder) => (): IsSeenResult => {
  const result = finder(KEY);

  return { ok: result.ok };
};

export const setLastSeen = setLastSeenWith(set);
export const checkIsSeen = checkIsSeenWith(find);
