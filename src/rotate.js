/**
 * adds button to toolbar, when episode is opened
 */
export function addButton() {
	const toolbar = document.querySelector("#_toolBarRightArea");
	const button = document.createElement("button");
	button.classList.add("btn-rotate");
	button.id = "btn-rotate";
	button.addEventListener("click", rotate)
	toolbar.prepend(button);
	return button;
}

/**
 * switch between landscape and standard mode in episode viewer
 * 
 * @example
 * rotate();
 */
export function rotate() {
	const viewer = document.querySelector("#_viewerBox");
	viewer.classList.toggle("viewer-rotate");
}
