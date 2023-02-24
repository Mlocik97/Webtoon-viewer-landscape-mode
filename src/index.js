// import from `rotate.js`, and remove function from here.

/**
 * adds button to toolbar, when episode is opened
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
 * rotate();
 */
function rotate() {
	const viewer = document.querySelector('#_viewerBox');

	const scrollPositionX = window.scrollX;
	const scrollPositionY = window.scrollY;

	viewer.classList.toggle('viewer-rotate');

	if (viewer.classList.contains("viewer-rotate")) {
		window.scrollTo(scrollPositionY, 0)
	} else {
		window.scrollTo(0, scrollPositionX)
	}
}

setTimeout(addButton, 1000);
