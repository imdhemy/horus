import React, { Component } from "react";
import { Link } from "react-router-dom";
import config from "./config";

import RomLibrary from "./RomLibrary";
import { AppHeader } from "./component/app-header";
import { RomList } from "./component/rom-list";

function toRomList(roms) {
  const result = [];
  Object.keys(roms).map((i) => {
    result.push({
      id: i,
      name: roms[i]["name"],
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

  render() {
    return (
      <div
        className="h-full"
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        <div className="max-w-3xl mx-auto py-4 pb-6">
          <AppHeader />
          <RomList roms={toRomList(config.ROMS)} />
          <p>
            Or, drag and drop a ROM file onto the page to play it. (Google may
            help you find them.)
          </p>

          {this.state.romLibrary.length > 0 ? (
            <div className="mt-10">
              <p className="mb-4">Previously played:</p>

              <div>
                {this.state.romLibrary
                  .sort((a, b) => new Date(b.added) - new Date(a.added))
                  .map((rom) => (
                    <Link
                      key={rom.hash}
                      to={"run/local-" + rom.hash}
                      className="block px-5 py-3 border border-gray-300 bg-black text-gray-100 no-underline hover:text-gray-100"
                    >
                      {rom.name}
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          this.deleteRom(rom.hash);
                        }}
                        className="text-red-600 ml-3 text-2xl leading-none relative top-0.5 hover:text-red-900 cursor-pointer"
                        title="Delete"
                      >
                        &times;
                      </span>
                      <span className="float-right">&rsaquo;</span>
                    </Link>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  deleteRom = (hash) => {
    RomLibrary.delete(hash);
    this.updateLibrary();
  };

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

    RomLibrary.save(file).then((rom) => {
      this.updateLibrary();
      this.props.history.push({ pathname: "run/local-" + rom.hash });
    });
  };
}

export default ListPage;
