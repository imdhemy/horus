# Horus Web UI

The current React web frontend for Horus, a fork of [JSNES](https://github.com/bfirsh/jsnes), maintained by Dhemy.

The local emulator dependency remains named `jsnes` for compatibility with existing imports. See [the root README](../README.md) for project information and upstream attribution.

## Running in development

    $ npm install
    $ npm start

## Building for production

    $ npm run build

The built app will be in `dist/`.

## Publishing to GitHub Pages

Publishing is manual. After the workflow is merged into the default branch,
open **Actions → Deploy web to GitHub Pages → Run workflow**, select the
source branch, and run it. The workflow builds `web` and publishes `web/dist`
to the root of `gh-pages`, including `.nojekyll`. Pushes and pull requests do
not trigger this workflow.

For the first deployment:

1. Run the workflow to create and populate `gh-pages`. If Pages is not yet
   configured, the final **Request Pages build** step will fail; the published
   branch remains available for the next step.
2. Open **Settings → Pages**, choose **Deploy from a branch**, and select
   **gh-pages** and **/ (root)**. Save the settings.
3. Run the workflow again. It explicitly requests a Pages build because pushes
   made using `GITHUB_TOKEN` do not automatically trigger one.
4. Wait for the Pages build and deployment to finish, then open the site URL
   shown in Settings → Pages. A successful branch publish alone does not mean
   the site has finished deploying.

For subsequent releases, run the workflow manually and wait for the Pages
deployment. No personal access token is required; the workflow uses the
repository token with contents and Pages write permissions.

After deployment, check that the library loads, a game opens, and its controls
respond. Record observed issues as follow-ups. This workflow publishes the
current app without changing routing or asset paths.

## Running tests

    $ npm test

## Formatting code

All code must conform to [Prettier](https://prettier.io/) formatting. The test suite won't pass unless it does.

To automatically format all your code, run:

    $ npm run format

## Debug logging

Debug logging is off by default. To enable it, run this in the browser console:

    localStorage.jsnes_debug = 1

To disable:

    delete localStorage.jsnes_debug

This logs FPS, audio buffer underruns/overruns, frame skips, and NES status updates.

## Upstream embedding notes

Unfortunately this isn't trivial at the moment. The best way is copy and paste code from this repository into a React app, then use the [`<Emulator>`](https://github.com/bfirsh/jsnes-web/blob/master/src/Emulator.js). [Here is a usage example.](https://github.com/bfirsh/jsnes-web/blob/d3c35eec11986412626cbd08668dbac700e08751/src/RunPage.js#L119-L125).

These links describe the upstream JSNES web integration; they do not describe a published Horus package.

## Adding roms

Open `src/config.js` and add a new key to `config.ROMS`. For example:

```javascript
const config = {
  ROMS: {
    // ...
    myrom: {
      name: "My Rom",
      description: <span>This is my own homebrew NES rom</span>,
      url: "http://localhost:3000/roms/myrom/myrom.nes"
    }
  }
}
```

Then, add the ROM file as `public/roms/myrom/myrom.nes`. The ROM should now be available to play at http://localhost:3000/run/myrom
