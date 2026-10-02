export const findIn =
  (document: Document) =>
  (key: string): string | undefined => {
    const prefix = `${encodeURIComponent(key)}=`;
    const entry = document.cookie
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(prefix));

    if (entry === undefined) return undefined;

    return decodeURIComponent(entry.slice(prefix.length));
  };

const write = (
  document: Document,
  key: string,
  value: string,
  maxAge?: number,
): void => {
  const lifetime = maxAge === undefined ? "" : `; Max-Age=${maxAge}`;
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${lifetime}; Path=/; SameSite=Lax`;
};

export const setIn =
  (document: Document) =>
  (key: string, value: string, maxAge: number): void => {
    if (!Number.isFinite(maxAge) || !Number.isInteger(maxAge) || maxAge < 0) {
      throw new Error(
        "maxAge must be a finite non-negative integer in seconds",
      );
    }
    write(document, key, value, maxAge);
  };

export const setSessionIn =
  (document: Document) =>
  (key: string, value: string): void => {
    write(document, key, value);
  };

export const removeFrom =
  (document: Document) =>
  (key: string): void => {
    write(document, key, "", 0);
  };

export const cookie = {
  find: findIn(document),
  set: setIn(document),
  setSession: setSessionIn(document),
  remove: removeFrom(document),
};
