// import from `rotate.js`, and remove function from here.

/**
 * adds button to toolbar, when episode is opened
 */
function addButton() {
	console.log('button was added');
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
	// const viewer = document.querySelector("#_viewerBox");
	// viewer.classList.toggle("viewer-rotate");
	const content = document.querySelector('#content');
	const viewer = document.querySelector('#_viewerBox');
	const viewer_lst = document.querySelector('#_viewerBox > div');

	
	viewer.classList.toggle('viewer-rotate');


	[viewer_lst, content].forEach((el) => {
		el.classList.toggle('viewer-reset-margin');
	});
}

// this fails
// document.addEventListener('DOMContentLoaded', addButton);

setTimeout(addButton, 1000);
