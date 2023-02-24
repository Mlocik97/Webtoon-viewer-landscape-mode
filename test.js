import { test } from 'uvu';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import fetch from 'node-fetch';
import * as assert from 'uvu/assert';
import { addButton } from './src/rotate.js';

const URL =
	'https://www.webtoons.com/en/fantasy/soleil/s3-episode-128/viewer?title_no=1823&episode_no=128';
const html = await fetch(URL).then((r) => r.text());

const dom = new JSDOM(html);
installPolyfills({
	window: dom.window,
	document: dom.window.document,
});

const cssFile = fs.readFileSync("./src/style.css", {
	encoding: "utf-8"
});

const styleElement = document.createElement("style");
styleElement.textContent = cssFile;
document.head.appendChild(styleElement);

addButton();
const button = document.querySelector("#btn-rotate")

test('Rotate button display', () => {
	assert.is(button.tagName, "BUTTON")
});

test("Button trigger rotating", () => {
	button.click();
	const viewer = document.querySelector("#_viewerBox");
	const rotated = viewer.classList.contains("viewer-rotate");
	assert.is(rotated, true);
	button.click();
	const viewer2 = document.querySelector("#_viewerBox");
	const rotated2 = viewer2.classList.contains("viewer-rotate");
	assert.is(rotated2, false);
})

test("Rotating works", () => {
	button.click();
	const viewer = document.querySelector("#_viewerBox");
	const rotated = viewer.classList.contains("viewer-rotate");
	assert.is(rotated, true);
	const transform = window.getComputedStyle(viewer).getPropertyValue("transform");
	assert.is(transform, "rotate(-90deg)");
})

test.run();

/**
 * @example
 * const dom = new JSDOM(html);
 * const globals = {
 * 		window: dom.window,
 * 		document: dom.window.document
 * };
 * installPolyfills(globals)
 *
 * @param {{[key: string]: *}} globals
 */
function installPolyfills(globals) {
	for (const name in globals) {
		Object.defineProperty(globalThis, name, {
			enumerable: true,
			configurable: true,
			writable: true,
			value: globals[name],
		});
	}
}
