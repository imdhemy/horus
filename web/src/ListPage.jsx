import React, { Component } from "react";
import config from "./config";

import RomLibrary from "./RomLibrary";
import { AppHeader } from "./component/app-header";
import { RomList } from "./component/rom-list";

function toBuiltInRomList(roms) {
  const result = [];
  Object.keys(roms).map((i) => {
    result.push({
      id: i,
      name: roms[i]["name"],
      path: i,
      removable: false,
    });
  });
  return result;
}

function toLocalRomList(roms) {
  const result = [];
  roms
    .sort((a, b) => new Date(b.added) - new Date(a.added))
    .map((rom) => {
      result.push({
        id: rom.hash,
        name: rom.name,
        path: `local-${rom.hash}`,
        removable: true,
      });
    });

  return result;
}

class ListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      romLibrary: RomLibrary.load(),
    };
  }

  handleDeleteRom = (rom) => {
    RomLibrary.delete(rom.id);
    this.updateLibrary();
  };

  render() {
    return (
      <div
        className="h-full"
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        <div className="max-w-3xl mx-auto py-4 pb-6">
          <AppHeader />
          <RomList roms={toBuiltInRomList(config.ROMS)} />
          <p>
            Or, drag and drop a ROM file onto the page to add it to your
            library. (Google may help you find them.)
          </p>
          <div className="mt-10">
            <p className="mb-4">Previously played:</p>
            <RomList
              onDelete={this.handleDeleteRom}
              roms={toLocalRomList(this.state.romLibrary)}
            />
          </div>
        </div>
      </div>
    );
  }

  updateLibrary = () => {
    this.setState({ romLibrary: RomLibrary.load() });
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.items
      ? e.dataTransfer.items[0].getAsFile()
      : e.dataTransfer.files[0];

    RomLibrary.save(file).then(() => {
      this.updateLibrary();
    });
  };
}

export default ListPage;
