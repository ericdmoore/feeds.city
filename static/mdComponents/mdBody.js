((win) => {
	class MyComponent extends HTMLElement {
		constructor() {
			super();
		}

		// Invoked when the custom element is first connected to the document's DOM.
		connectedCallback() {
			this.innerHTML = `<h1>Hello world</h1>`;
		}

		// Invoked when the custom element is disconnected from the document's DOM.
		disconnectedCallback() {}

		// Invoked when the custom element is moved to a new document.
		adoptedCallback() {}

		// Invoked when one of the custom element's attributes is added, removed, or changed.
		attributeChangedCallback(name, oldVal, newVal) {
			console.log({ name, oldVal, newVal });
		}
	}

	// export to window
	win.customElements.define("hello", MyComponent);
})(window);
