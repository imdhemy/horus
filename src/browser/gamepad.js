import Controller from "../controller.js";
import PlayerInputs from "./player-inputs.js";

export default class GamepadController {
  constructor(options) {
    this.onButtonDown = options.onButtonDown;
    this.onButtonUp = options.onButtonUp;
    this.gamepadState = [];
    this.buttonCallback = null;
    this.inputs = new PlayerInputs(options);
  }

  ensureDefaultConfig = (gamepad) => {
    if (
      gamepad.mapping !== "standard" ||
      this.gamepadConfig?.configs?.[gamepad.id]
    ) {
      return;
    }

    const mapping = [
      [0, Controller.BUTTON_A],
      [2, Controller.BUTTON_B],
      [8, Controller.BUTTON_SELECT],
      [9, Controller.BUTTON_START],
      [12, Controller.BUTTON_UP],
      [13, Controller.BUTTON_DOWN],
      [14, Controller.BUTTON_LEFT],
      [15, Controller.BUTTON_RIGHT],
    ];
    this.gamepadConfig = {
      ...this.gamepadConfig,
      playerGamepadId: this.gamepadConfig?.playerGamepadId || [null, null],
      configs: {
        ...this.gamepadConfig?.configs,
        [gamepad.id]: {
          buttons: mapping.map(([code, buttonId]) => ({
            type: "button",
            code,
            buttonId,
          })),
        },
      },
    };
  };

  poll = () => {
    const gamepads = Array.from(
      navigator.getGamepads?.() || navigator.webkitGetGamepads?.() || [],
    ).filter(Boolean);

    for (const index of this.inputs.devices.keys()) {
      if (!gamepads.some((gamepad) => gamepad.index === index)) {
        this.inputs.disconnect(index);
        delete this.gamepadState[index];
      }
    }

    for (const gamepad of gamepads) {
      this.ensureDefaultConfig(gamepad);
      this.inputs.connect(gamepad);
      const previous = this.gamepadState[gamepad.index];
      if (this.buttonCallback && previous?.id === gamepad.id) {
        const button = gamepad.buttons.findIndex(
          (value, code) => value.pressed && !previous.buttons[code]?.pressed,
        );
        const axis = gamepad.axes.findIndex(
          (value, code) =>
            Math.abs(value) === 1 && value !== previous.axes[code],
        );
        if (button !== -1 || axis !== -1) {
          this.buttonCallback({
            gamepadId: gamepad.id,
            gamepadIndex: gamepad.index,
            type: button !== -1 ? "button" : "axis",
            code: button !== -1 ? button : axis,
            value: button !== -1 ? undefined : gamepad.axes[axis],
          });
        }
      } else if (!this.buttonCallback) {
        const pressed = new Set();
        for (const binding of this.gamepadConfig?.configs?.[gamepad.id]
          ?.buttons || []) {
          const down =
            binding.type === "button"
              ? gamepad.buttons[binding.code]?.pressed
              : gamepad.axes[binding.code] === binding.value;
          if (down) pressed.add(binding.buttonId);
        }
        this.inputs.gamepadButtons(gamepad.index, pressed);
      }
      this.gamepadState[gamepad.index] = {
        id: gamepad.id,
        buttons: gamepad.buttons.map(({ pressed }) => ({ pressed })),
        axes: gamepad.axes.slice(),
      };
    }
  };

  promptButton = (f) => {
    if (!f) {
      this.buttonCallback = f;
    } else {
      this.buttonCallback = (buttonInfo) => {
        this.buttonCallback = null;
        f(buttonInfo);
      };
    }
  };

  loadGamepadConfig = () => {
    var gamepadConfig;
    try {
      gamepadConfig = localStorage.getItem("gamepadConfig");
      if (gamepadConfig) {
        gamepadConfig = JSON.parse(gamepadConfig);
      }
    } catch (e) {
      console.warn("Failed to get gamepadConfig from localStorage.", e);
    }

    this.gamepadConfig = gamepadConfig;
  };

  setGamepadConfig = (gamepadConfig) => {
    this.inputs.release(1);
    this.inputs.release(2);
    this.gamepadConfig = gamepadConfig;
    try {
      localStorage.setItem("gamepadConfig", JSON.stringify(gamepadConfig));
    } catch (e) {
      console.warn("Failed to set gamepadConfig in localStorage.", e);
    }
  };

  startPolling = () => {
    if (!(navigator.getGamepads || navigator.webkitGetGamepads)) {
      return { stop: () => {} };
    }

    let stopped = false;
    const loop = () => {
      if (stopped) return;

      this.poll();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return {
      stop: () => {
        stopped = true;
        this.inputs.release(1);
        this.inputs.release(2);
      },
    };
  };
}
