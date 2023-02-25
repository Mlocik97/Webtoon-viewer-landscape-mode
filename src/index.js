/** @TODO import `addButton` and `rotate` from `rotate.js` */

/**
 * adds button to toolbar, when episode is opened
 * 
 * @example
 * addButton();
 */
function addButton() {
	const toolbar = document.querySelector('#_toolBarRightArea');
	const button = document.createElement('button');
	button.classList.add('btn-rotate');
	button.id = 'btn-rotate';
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

	const scrollPositionX = window.scrollX;
	const scrollPositionY = window.scrollY;

	viewer.classList.toggle('viewer-rotate');
	document.body.classList.toggle("rotate-fix-scrollbar")

	if (viewer.classList.contains("viewer-rotate")) {
		window.scrollTo(scrollPositionY, 120)
	} else {
		window.scrollTo(0, scrollPositionX)
	}
}

addButton();