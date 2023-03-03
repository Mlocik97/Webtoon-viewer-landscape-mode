import { test } from 'uvu';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import fetch from 'node-fetch';
import * as assert from 'uvu/assert';

/** fetch HTML from webtoon episode viewer */
const URL =
	'https://www.webtoons.com/en/fantasy/soleil/s3-episode-128/viewer?title_no=1823&episode_no=128';
const html = await fetch(URL).then((r) => r.text());

/** create DOM */

const dom = new JSDOM(html, {
	runScripts: "dangerously"
});

/** make window, document and window.scrollTo globals */

installPolyfills({
	window: dom.window,
	document: dom.window.document,
});
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

/** inject CSS */
const cssFile = fs.readFileSync("./src/style.css", {
	encoding: "utf-8"
});

const styleElement = document.createElement("style");
styleElement.textContent = cssFile;
document.head.appendChild(styleElement);

/** inject JS */
const jsFile = fs.readFileSync("./src/index.js", {
	encoding: "utf-8"
})

const scriptElement = document.createElement("script");
scriptElement.textContent = jsFile;
document.head.append(scriptElement);

/** tests */

const button = document.querySelector("#btn-rotate");

test('Rotate button is inserted', () => {
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
	const button = document.querySelector("#btn-rotate");
	button.click();
	const viewer = document.querySelector("#_viewerBox");
	const rotated = viewer.classList.contains("viewer-rotate");
	assert.is(rotated, true);
	const transform = window.getComputedStyle(viewer).getPropertyValue("transform");
	assert.is(transform, "rotate(-90deg) translateX(-100%)");
})

test("vertical scrollbar is hidden in landscape", () => {
	const overflow = window.getComputedStyle(document.body).getPropertyValue("overflow-y");
	assert.is(overflow, "hidden");
})

test("episodde is visible", () => {
	// TODO
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
