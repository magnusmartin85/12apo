# Off-Canvas Menu

> Simple JavaScript Off-Canvas Menu.

## Features

- Simple
- Mobile first
- Multi level
- Lightweight
- No dependencies

## Getting started

1. Download the zip file of the latest release from GitHub. You will find HTML, JS and CSS file inside.
2. Include the CSS file at the top of your page in the head section:
   `<link href="path/to/12apo-core.css" rel="stylesheet" />`
3. Place the script tag at the bottom of your page right before the closing body tag:
   `<script src="path/to/12apo-core.js"></script>`
4. Create a navigation list for your off-canvas menu:
   ```
     <div class="off-canvas">
      <div class="off-canvas-body">
        <nav class="off-canvas-nav">
          <ul>
            <li>
              <a href="#">Guit / Bass</a>
              <ul>
                <li>
                  <a href="#">Electric Guitars</a>
                </li>
                <li>
                  <a href="#">Classical Guitars</a>
                </li>
                <li>
                  <a href="#">Acoustic Guitars</a>
                </li>
                <li>
                  <a href="#">Eletric Basses</a>
                </li>
                <li>
                  <a href="#">Bluegrass Instruments</a>
                  <ul>
                    <li>
                      <a href="#">Banjos</a>
                    </li>
                    <li>
                      <a href="#">Mandolins</a>
                    </li>
                    <li>
                      <a href="#">Lap Steel Guitars</a>
                    </li>
                    <li>
                      <a href="#">Resonator Guitars</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Electric Guitar Amps</a>
                  <ul>
                    <li>
                      <a href="#">Electric Guitar Combos</a>

                      <ul>
                        <li>
                          <a href="">Solid-State Guitar Combos</a>
                        </li>
                        <li>
                          <a href="">Tube Guitar Combos</a>
                        </li>
                        <li>
                          <a href="">Modeling Guitar Combos</a>
                        </li>
                        <li>
                          <a href="">Hybrid Guitar Combos</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Electric Guitar Amp Heads</a>
                      <ul>
                        <li>
                          <a href="">Solid-State Guitar Heads</a>
                        </li>
                        <li>
                          <a href="">Tube Guitar Heads</a>
                        </li>
                        <li>
                          <a href="">Modeling Guitar Heads</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">Drums</a>
              <ul>
                <li>
                  <a href="#">Acoustic Drums</a>
                  <ul>
                    <li>
                      <a href="#">Acoustic Drumkits</a>
                    </li>
                    <li>
                      <a href="#">Drum Shell Sets</a>
                    </li>
                    <li>
                      <a href="#">Premium Drum Kits</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Electronic Drums</a>
                  <ul>
                    <li>
                      <a href="#">Electronic Drumkits</a>
                    </li>
                    <li>
                      <a href="#">Electronic Drum Sound Modules</a>
                    </li>
                    <li>
                      <a href="#">Percussion and Sampling Pads</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Cymbals</a>
                </li>
                <li>
                  <a href="#">Sticks and Mallets</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
   ```

5. Create a menu toggle:
   ```
   <aside class="icon-open-row">
      <div class="icon-open-container">
        <div class="icon-open-col-1">☰</div>
        <div class="icon-open-col-2">Open Menu</div>
      </div>
   </aside>
   ```

## Local development / Collaboration

Feel free to reach out for any kind of cooperation or feedback. PRs welcome.

### Installation

For installation cd into the project root and run `npm install`.

### Development

To serve on localhost run `npm run start` on the command line.

### Build

For a production build run `npm run build` on the command line.
This will generate a `public` directory with `index.html`, `12apo-core.js` and `12apo-core.css`.

## Demo

[Demo](https://12apo.com)

## Built with

### [TypeScript](https://www.typescriptlang.org/)

TypeScript is JavaScript with syntax for types.

### [Sass](https://sass-lang.com/)

CSS with superpowers.

### [webpack](https://webpack.js.org/)

Module Bundler for JavaScript.

## Author

[Magnus Martin](https://mgnmrt.com/)
