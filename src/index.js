const icon = chrome
	// chrome
	? chrome.runtime.getURL("/images/icon-rotate.png")
	// firefox
	// @ts-ignore
	: browser.runtime.getURL("/images/icon-rotate.png");

/**
 * adds button to toolbar, when episode is opened
 * 
 * @example
 * addButton();
 */
function addButton() {
	const toolbar = document.querySelector('#_toolBarRightArea');
	const button = document.createElement("button");
	button.classList.add('btn-rotate');
	button.textContent = "rotate";
	button.id = 'btn-rotate';
	button.style.setProperty("background-image", `url(${icon})`)
	button.addEventListener('click', rotate);
	toolbar.prepend(button);
	return button;
}

/**
 * switch between landscape and standard mode in episode viewer
 *
 * @example
 * button.addEventListener('click', rotate);
 */
function rotate() {
	const viewer = document.querySelector('#_viewerBox');
	const toTop = document.querySelector("#_topBtn");

	const scrollPositionX = window.scrollX;
	const scrollPositionY = window.scrollY;

	viewer.classList.toggle('viewer-rotate');
	toTop.classList.toggle("viewer-rotate-hide-toTop");
	document.body.classList.toggle("rotate-fix-scrollbar");

	if (viewer.classList.contains("viewer-rotate")) {
		window.scrollTo(scrollPositionY, 120)

		document.body.addEventListener("wheel", wheelX, {
			passive: false
		})
	} else {
		window.scrollTo(0, scrollPositionX)
		document.body.removeEventListener("wheel", wheelX);
	}
}

/**
 * mouse wheel will scroll by X axis in landscape mode
 * 
 * @example
 * document.addEventListener("wheel", wheelX)
 * 
 * @param {WheelEvent} evt 
 */
function wheelX(evt) {
	evt.preventDefault();
	window.scrollBy({
		left: evt.deltaY
	})
};

addButton();