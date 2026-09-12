// Assignments are session-local: browser device indices are not persistent IDs.
export default class PlayerInputs {
  constructor({ onButtonDown, onButtonUp }) {
    this.onButtonDown = onButtonDown;
    this.onButtonUp = onButtonUp;
    this.players = [undefined, undefined];
    this.devices = new Map();
    this.held = [new Set(), new Set()];
    this.listeners = new Set();
  }

  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  notify = () => {
    for (const listener of this.listeners) listener();
  };

  release = (player) => {
    for (const button of this.held[player - 1]) this.onButtonUp(player, button);
    this.held[player - 1].clear();
  };

  select = (player, index) => {
    if (player !== 1 && player !== 2) throw new Error("Invalid player");
    if (index !== null) {
      if (!this.devices.has(index)) throw new Error("Gamepad is disconnected");
      if (
        this.players.some(
          (device, slot) => slot !== player - 1 && device?.index === index,
        )
      ) {
        throw new Error("Gamepad is already assigned to another player");
      }
    }
    this.release(player);
    this.players[player - 1] = index === null ? null : this.devices.get(index);
    this.notify();
  };

  connect = ({ id, index }) => {
    if (this.devices.get(index)?.id === id) return;
    if (this.devices.has(index)) this.disconnect(index);
    const device = { id, index };
    this.devices.set(index, device);
    const assigned = this.players.findIndex((entry) => entry?.index === index);
    if (assigned !== -1 && this.players[assigned].id !== id) {
      // A different device reused this slot; require an explicit selection.
      this.players[assigned] = null;
    } else if (assigned === -1) {
      const available = this.players.indexOf(undefined);
      if (available !== -1) {
        this.release(available + 1);
        this.players[available] = device;
      }
    }
    this.notify();
  };

  disconnect = (index) => {
    if (!this.devices.delete(index)) return;
    this.players.forEach((device, slot) => {
      if (device?.index === index) this.release(slot + 1);
    });
    this.notify();
  };

  keyboardDown = (player, button) => {
    if (this.players[player - 1] || this.held[player - 1].has(button)) return;
    this.held[player - 1].add(button);
    this.onButtonDown(player, button);
  };

  keyboardUp = (player, button) => {
    if (this.players[player - 1]) return;
    if (this.held[player - 1].delete(button)) this.onButtonUp(player, button);
  };

  gamepadButtons = (index, buttons) => {
    const slot = this.players.findIndex((device) => device?.index === index);
    if (slot === -1 || !this.devices.has(index)) return;
    for (const button of this.held[slot]) {
      if (!buttons.has(button)) this.onButtonUp(slot + 1, button);
    }
    for (const button of buttons) {
      if (!this.held[slot].has(button)) this.onButtonDown(slot + 1, button);
    }
    this.held[slot] = buttons;
  };
}
