import React, { Component } from "react";
import { Controller } from "jsnes";
import ControlMapperRow from "./ControlMapperRow";

const GAMEPAD_ICON = "../img/nes_controller.png";
const KEYBOARD_ICON = "../img/keyboard.png";

class ControlsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gamepadConfig: {
        ...props.gamepadConfig,
        playerGamepadId: props.gamepadController.inputs.players.map(
          (device) => device?.id || null,
        ),
      },
      keys: props.keys,
      button: undefined,
      modified: false,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleGamepadButtonDown = this.handleGamepadButtonDown.bind(this);
    this.listenForKey = this.listenForKey.bind(this);

    this.state.gamepadConfig = this.state.gamepadConfig || {};
    this.state.gamepadConfig.playerGamepadId = this.state.gamepadConfig
      .playerGamepadId || [null, null];
    this.state.gamepadConfig.configs = this.state.gamepadConfig.configs || {};

    this.state.controllerIcon = this.state.gamepadConfig.playerGamepadId.map(
      (gamepadId) => (gamepadId ? GAMEPAD_ICON : KEYBOARD_ICON),
    );
    this.state.controllerIconAlt = this.state.gamepadConfig.playerGamepadId.map(
      (gamepadId) => (gamepadId ? "gamepad" : "keyboard"),
    );
    this.state.currentPromptButton = -1;
  }

  componentDidMount() {
    this.unsubscribeInputs = this.props.gamepadController.inputs.subscribe(
      () => {
        const playerGamepadId = this.props.gamepadController.inputs.players.map(
          (device) => device?.id || null,
        );
        this.removeKeyListener();
        this.setState((state) => ({
          gamepadConfig: {
            configs: {
              ...this.props.gamepadController.gamepadConfig?.configs,
              ...state.gamepadConfig.configs,
            },
            playerGamepadId,
          },
          currentPromptButton: -1,
          controllerIcon: playerGamepadId.map((id) =>
            id ? GAMEPAD_ICON : KEYBOARD_ICON,
          ),
          controllerIconAlt: playerGamepadId.map((id) =>
            id ? "gamepad" : "keyboard",
          ),
        }));
      },
    );
  }

  componentWillUnmount() {
    this.unsubscribeInputs();
    if (this.state.modified) {
      this.props.setKeys(this.state.keys);
      this.props.setGamepadConfig(this.state.gamepadConfig);
    }
    this.removeKeyListener();
  }

  listenForKey(button) {
    var currentPromptButton = button[1];
    this.props.gamepadController.inputs.release(button[0]);

    this.removeKeyListener();
    this.setState({ button, currentPromptButton });
    const device = this.props.gamepadController.inputs.players[button[0] - 1];
    if (device) {
      this.props.promptButton(this.handleGamepadButtonDown);
    } else {
      document.addEventListener("keydown", this.handleKeyDown);
    }
  }

  handleGamepadButtonDown(buttonInfo) {
    const selected =
      this.props.gamepadController.inputs.players[this.state.button[0] - 1];
    if (selected?.index !== buttonInfo.gamepadIndex) {
      this.props.promptButton(this.handleGamepadButtonDown);
      return;
    }
    this.removeKeyListener();

    var button = this.state.button;

    const playerId = button[0];
    const buttonId = button[1];

    const gamepadId = buttonInfo.gamepadId;
    const gamepadConfig = this.state.gamepadConfig;

    // link player to gamepad
    const playerGamepadId = gamepadConfig.playerGamepadId.slice(0);
    const newConfig = {};

    playerGamepadId[playerId - 1] = gamepadId;

    const rejectButtonId = (b) => {
      return b.buttonId !== buttonId;
    };

    const newButton = {
      code: buttonInfo.code,
      type: buttonInfo.type,
      buttonId: buttonId,
      value: buttonInfo.value,
    };
    newConfig[gamepadId] = {
      buttons: (gamepadConfig.configs[gamepadId] || { buttons: [] }).buttons
        .filter(rejectButtonId)
        .concat([newButton]),
    };

    const configs = Object.assign({}, gamepadConfig.configs, newConfig);

    this.setState({
      gamepadConfig: {
        configs: configs,
        playerGamepadId: playerGamepadId,
      },
      currentPromptButton: -1,
      controllerIcon: playerGamepadId.map((gamepadId) =>
        gamepadId ? GAMEPAD_ICON : KEYBOARD_ICON,
      ),
      modified: true,
    });
  }

  handleKeyDown(event) {
    this.removeKeyListener();

    var button = this.state.button;
    var keys = this.state.keys;
    var newKeys = {};
    for (var key in keys) {
      if (keys[key][0] !== button[0] || keys[key][1] !== button[1]) {
        newKeys[key] = keys[key];
      }
    }

    const playerGamepadId = this.state.gamepadConfig.playerGamepadId.slice(0);
    const playerId = button[0];
    playerGamepadId[playerId - 1] = null;

    this.setState({
      keys: {
        ...newKeys,
        [event.keyCode]: [
          ...button.slice(0, 2),
          event.key.length > 1 ? event.key : String(event.key).toUpperCase(),
        ],
      },
      button: undefined,
      gamepadConfig: {
        configs: this.state.gamepadConfig.configs,
        playerGamepadId: playerGamepadId,
      },
      currentPromptButton: -1,
      controllerIcon: playerGamepadId.map((gamepadId) =>
        gamepadId ? GAMEPAD_ICON : KEYBOARD_ICON,
      ),
      controllerIconAlt: playerGamepadId.map((gamepadId) =>
        gamepadId ? "gamepad" : "keyboard",
      ),
      modified: true,
    });
  }

  removeKeyListener() {
    this.props.promptButton(null);
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    if (!this.props.isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        onClick={(e) => {
          if (e.target === e.currentTarget) this.props.toggle();
        }}
      >
        <div className="bg-black border border-white w-full max-w-lg mx-4 font-mono">
          <div className="flex items-center justify-between px-4 py-3">
            <h5 className="text-lg font-normal m-0">Controls</h5>
            <button
              onClick={this.props.toggle}
              className="text-white text-2xl leading-none bg-transparent border-none cursor-pointer"
            >
              &times;
            </button>
          </div>

          <div className="px-4 py-2">
            <div className="flex gap-4 mb-4">
              {[1, 2].map((player) => {
                const inputs = this.props.gamepadController.inputs;
                const selected = inputs.players[player - 1];
                const disconnected =
                  selected && !inputs.devices.has(selected.index);
                return (
                  <label key={player} className="flex-1 min-w-0">
                    Player {player} input
                    <select
                      aria-label={`Player ${player} input`}
                      className="block w-full bg-black text-white border border-white p-1 mt-1"
                      value={
                        selected === undefined
                          ? "auto"
                          : selected
                            ? String(selected.index)
                            : "keyboard"
                      }
                      onChange={(event) =>
                        inputs.select(
                          player,
                          event.target.value === "keyboard"
                            ? null
                            : Number(event.target.value),
                        )
                      }
                    >
                      {selected === undefined && (
                        <option value="auto" disabled>
                          Automatic (keyboard)
                        </option>
                      )}
                      <option value="keyboard">Keyboard</option>
                      {disconnected && (
                        <option value={selected.index}>
                          Gamepad {selected.index + 1} — disconnected
                        </option>
                      )}
                      {Array.from(inputs.devices.values()).map((device) => (
                        <option
                          key={device.index}
                          value={device.index}
                          disabled={inputs.players.some(
                            (entry, slot) =>
                              slot !== player - 1 &&
                              entry?.index === device.index,
                          )}
                        >
                          Gamepad {device.index + 1}: {device.id}
                        </option>
                      ))}
                    </select>
                    {disconnected && (
                      <span role="status">
                        Disconnected — choose another input.
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            <p className="text-sm mb-3">
              Connect a gamepad and press a button if it does not appear. Both
              players can choose keyboard with separate keys.
            </p>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 border-b border-white">
                    Button
                  </th>
                  <th className="text-left py-2 border-b border-white">
                    Player 1
                    <img
                      className="w-10 h-10 -mt-5 inline ml-1"
                      src={this.state.controllerIcon[0]}
                      alt={this.state.controllerIconAlt[0]}
                    />
                  </th>
                  <th className="text-left py-2 border-b border-white">
                    Player 2
                    <img
                      className="w-10 h-10 -mt-5 inline ml-1"
                      src={this.state.controllerIcon[1]}
                      alt={this.state.controllerIconAlt[1]}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <ControlMapperRow
                  buttonName="Left"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_LEFT}
                  prevButton={Controller.BUTTON_SELECT}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="Right"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_RIGHT}
                  prevButton={Controller.BUTTON_LEFT}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="Up"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_UP}
                  prevButton={Controller.BUTTON_RIGHT}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="Down"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_DOWN}
                  prevButton={Controller.BUTTON_UP}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="A"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_A}
                  prevButton={Controller.BUTTON_DOWN}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="B"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_B}
                  prevButton={Controller.BUTTON_A}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="Turbo A"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_TURBO_A}
                  prevButton={Controller.BUTTON_B}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="Turbo B"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_TURBO_B}
                  prevButton={Controller.BUTTON_TURBO_A}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="Start"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_START}
                  prevButton={Controller.BUTTON_TURBO_B}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
                <ControlMapperRow
                  buttonName="Select"
                  currentPromptButton={this.state.currentPromptButton}
                  button={Controller.BUTTON_SELECT}
                  prevButton={Controller.BUTTON_START}
                  keys={this.state.keys}
                  handleClick={this.listenForKey}
                  gamepadConfig={this.state.gamepadConfig}
                />
              </tbody>
            </table>
          </div>

          <div className="flex justify-end px-4 py-3">
            <button
              onClick={this.props.toggle}
              className="border border-white text-white px-3 py-1 bg-transparent hover:bg-white hover:text-black cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ControlsModal;
