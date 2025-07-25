import { test } from 'uvu';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import * as assert from 'uvu/assert';

/** fetch HTML from webtoon episode viewer */
const URL =
	'https://www.webtoons.com/en/fantasy/soleil/s3-episode-128/viewer?title_no=1823&episode_no=1';
const html = await fetch(URL).then((r) => r.text());

/** create DOM */

const dom = new JSDOM(html, {
	url: URL,
	referrer: 'https://www.webtoons.com/',
	runScripts: 'dangerously',
});

/** make window, document and window.scrollTo globals */

const browserAPI = {
	runtime: {
		getUrl: (url) => `.${url}`, // emulate relative path
	},
};

installPolyfills({
	window: dom.window,
	document: dom.window.document,
	chrome: browserAPI,
	browser: browserAPI,
});

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
Object.defineProperty(window, 'scrollBy', {
	value: function ({ left }) {
		this.scrollX = (this.scrollX || 0) + (left || 0);
	},
	writable: true,
});

/** inject CSS */
const cssFile = fs.readFileSync('./src/style.css', {
	encoding: 'utf-8',
});

const styleElement = document.createElement('style');
styleElement.textContent = cssFile;
document.head.appendChild(styleElement);

/** inject JS */
const jsFile = fs.readFileSync('./src/index.js', {
	encoding: 'utf-8',
});

const scriptElement = document.createElement('script');
scriptElement.textContent = jsFile

	// replace chrome object
	.replace(/chrome/g, '{ runtime: { getURL: (s) => s } }');

document.head.append(scriptElement);

/** tests */

const button = document.querySelector('#btn-rotate');
const viewer = document.querySelector('#_viewerBox');

test('Rotate button is inserted', () => {
	assert.is(button.tagName, 'BUTTON');
});

test('Button trigger rotating', () => {
	button.click();
	const rotated = viewer.classList.contains('viewer-rotate');
	assert.is(rotated, true);
	button.click();
	const rotated2 = viewer.classList.contains('viewer-rotate');
	assert.is(rotated2, false);
});

test('Rotating works', () => {
	button.click();
	const transform = window
		.getComputedStyle(viewer)
		.getPropertyValue('transform');
	assert.is(transform, 'rotate(-90deg) translateX(-100%)');
});

test('vertical scrollbar is hidden in landscape', () => {
	const overflow = window
		.getComputedStyle(document.body)
		.getPropertyValue('overflow-y');
	assert.is(overflow, 'hidden');
});

test('episode is visible', () => {
	button.click(); // enter landscape mode
	const viewer = document.querySelector('#_viewerBox');
	// Check if viewer is still visible and not clipped
	const isVisible =
		window.getComputedStyle(viewer).getPropertyValue('visibility') !== 'hidden';
	const isNotClipped =
		window.getComputedStyle(viewer).getPropertyValue('overflow') !== 'hidden';
	assert.is(isVisible, true);
	assert.is(isNotClipped, true);
});

test('scroll to Top is hidden', () => {
	button.click(); // ensure landscape mode
	const toTop = document.querySelector('#_topBtn');
	const hasHideClass = toTop.classList.contains('viewer-rotate-hide-toTop');
	assert.is(hasHideClass, true);
	button.click(); // restore to normal mode
	const isVisibleAgain = !toTop.classList.contains('viewer-rotate-hide-toTop');
	assert.is(isVisibleAgain, true);
});

test('wheel in landscape scroll by x axis', () => {
	button.click(); // enter landscape mode
	const initialScrollX = window.scrollX;

	// Simulate wheel event
	const wheelEvent = new dom.window.WheelEvent('wheel', {
		deltaY: 100,
		cancelable: true,
	});
	document.body.dispatchEvent(wheelEvent);

	// Check if scrollX changed
	const scrolled = window.scrollX > initialScrollX;
	assert.is(scrolled, true);
});

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
