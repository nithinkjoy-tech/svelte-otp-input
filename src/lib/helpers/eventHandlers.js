import {
	applyFocusStyle,
	getInputType,
	getSortedKeysByPriority,
	getValidInput,
	isIphoneOrIpad,
	removeFocusStyle,
	validateInput,
	detectBrowser,
} from './utils.js';

export class EventHandler {
	constructor(eventName) {
		this.eventName = eventName;
	}

	_handle(event, index, config) {
		if (Array.isArray(config)) {
			const [fn, mode] = config;

			if (typeof fn !== 'function') {
				throw new TypeError(
					`Expected '${this.eventName}' array's first index to be a function, but got ${typeof fn}`
				);
			}

			switch (mode) {
				case 'before':
					fn(event, index);
					this.defaultHandler(event, index);
					break;
				case 'after':
					this.defaultHandler(event, index);
					fn(event, index);
					break;
				case 'replace':
					fn(event, index);
					break;
				default:
					throw new TypeError(
						`Expected '${this.eventName}' array's second index to be one of: before, after, replace, but got ${mode}`
					);
			}
		} else if (config) {
			throw new TypeError(`Expected '${this.eventName}' to be an array, but got ${typeof config}`);
		} else {
			this.defaultHandler(event, index);
		}
	}
}

export class OnInputClass extends EventHandler {
	#onPasteInstance;

	constructor({ numInputs, _setFocusIndex, onPasteInstance }) {
		super("onInput");
		this.numInputs = numInputs;
		this.setFocusIndex = _setFocusIndex;
		this.#onPasteInstance = onPasteInstance;

		const { isChrome, isSafari } = detectBrowser();
		this.isChrome = isChrome;
		this.isSafari = isSafari;

		// Keep inputValues consistent with OnPasteClass
		this.inputValues = [];
	}

	#createFakePasteEvent(data) {
		return {
			clipboardData: {
				getData: () => data
			},
			preventDefault: () => {}
		};
	}

	defaultHandler(event, index) {
		const isDelete =
			event.inputType === "deleteContentBackward" ||
			event.key === "Backspace" ||
			event.key === "deleteContentCut";

		// Chrome autofill
		if (this.isChrome && event.data?.length === this.numInputs && index === 0) {
			this.#onPasteInstance.handleInputPaste(
				this.#createFakePasteEvent(event.data),
				0,
				null,
				false
			);
			setTimeout(() => {
				this.setFocusIndex(this.numInputs - 1);
			})
		}

		// Safari autofill
		if (this.isSafari && !("view" in event)) {
			this.inputValues.push(event.target.value);
			event.preventDefault();
			setTimeout(() => {
				this.#onPasteInstance.handleInputPaste(
					this.#createFakePasteEvent(this.inputValues.join("")),
					0,
					null,
					false
				);
				this.setFocusIndex(this.numInputs - 1);
			}, 100);
		}

		// Move focus
		const focusIndex = isDelete
			? index - 1
			: Math.min(index + 1, this.numInputs - 1);

		this.setFocusIndex(focusIndex);
	}

	handleOnInput(event, index, onInput) {
		this._handle(event, index, onInput);
	}
}


export class KeyDownClass extends EventHandler {
	constructor({
		numInputs,
		_inputRefs,
		_setFocusIndex,
		onInputInstance,
		onFocusInstance,
		inputType,
		onEnter,
		getValue
	}) {
		super('keyDown');
		this.numInputs = numInputs;
		this.inputRefs = _inputRefs;
		this.setFocusIndex = _setFocusIndex;
		this.onInputInstance = onInputInstance;
		this.onFocusInstance = onFocusInstance;
		this.inputType = inputType;
		this.onEnter = onEnter;
		this.getValue = getValue;
	}

	defaultHandler(event, index) {
		switch (event.key) {
			case 'Backspace':
				this.inputRefs[index].value
					? this.onInputInstance.handleOnInput(event, isIphoneOrIpad() ? index + 1 : index)
					: this.onFocusInstance.handleInputFocus(event, index - 1);
				break;
			case 'Enter':
				if (this.onEnter) {
					if (typeof this.onEnter === 'function') {
						this.onEnter(this.getValue());
					} else {
						throw new TypeError('onEnter must be a function');
					}
				}
				break;
			case 'Tab':
				this.defaultHandler({ ...event, key: 'ArrowRight' }, index);
				break;
			case 'ArrowLeft':
				this.setFocusIndex(index > 0 ? index - 1 : index);
				if (index === 0) event.preventDefault();
				break;
			case 'ArrowRight':
				this.setFocusIndex(index < this.numInputs - 1 ? index + 1 : index);
				if (index === this.numInputs - 1) {
					if ('preventDefault' in event) event.preventDefault();
				}
				break;
			case 'ArrowUp':
			case 'ArrowDown':
				event.preventDefault();
				break;
			default:
				validateInput(event, index, this.inputType);
		}
	}

	handleKeyDown(event, index, keyDown) {
		this._handle(event, index, keyDown);
	}
}

export class OnFocusClass extends EventHandler {
	constructor({ _inputRefs, inputFocusStyle, _setFocusIndex, stylePriority, isError }) {
		super('onFocus');
		this.inputRefs = _inputRefs;
		this.inputFocusStyle = inputFocusStyle;
		this.setFocusIndex = _setFocusIndex;
		this.stylePriority = stylePriority;
		this.isError = isError;
	}

	defaultHandler(event, index) {
		this.setFocusIndex(index);
		if (!this.inputFocusStyle) return;

		const sortedKeys = getSortedKeysByPriority(this.stylePriority);
		const shouldApply =
			!this.isError ||
			sortedKeys.indexOf('inputErrorStyle') > sortedKeys.indexOf('inputFocusStyle');

		if (shouldApply && this.inputFocusStyle) {
			applyFocusStyle(this.inputRefs[index], this.inputFocusStyle);

			if (event.key === 'Backspace' || event.key === 'Backspace') {
				removeFocusStyle(this.inputRefs[index]);
			}
		}
	}

	handleInputFocus(event, index, onFocus) {
		this._handle(event, index, onFocus);
	}
}

export class OnBlurClass extends EventHandler {
	constructor({ _inputRefs, inputFocusStyle }) {
		super('onBlur');
		this.inputRefs = _inputRefs;
		this.inputFocusStyle = inputFocusStyle;
	}

	defaultHandler(event, index) {
		if (this.inputFocusStyle) {
			removeFocusStyle(this.inputRefs[index]);
		}
	}

	handleInputBlur(event, index, onBlur) {
		this._handle(event, index, onBlur);
	}
}

export class OnPasteClass extends EventHandler {
	#restrictPaste = false;

	constructor({ numInputs, _inputValues, _setFocusIndex, inputType }) {
		super('onPaste');
		this.numInputs = numInputs;
		this.inputValues = _inputValues;
		this.setFocusIndex = _setFocusIndex;
		this.inputType = inputType;
	}

	defaultHandler(event, currentIndex) {
		event.preventDefault();
		if (this.#restrictPaste) return;
		const clipboardText = event.clipboardData
			.getData('text/plain')
			.slice(0, this.numInputs) // limit to max input length
			.split('');

		let insertionStartIndex = currentIndex - 1;

		// Handle case where previous value is 'v' (from Ctrl+V)
		if (this.inputValues[currentIndex - 1]?.toLowerCase() === 'v') {
			this.inputValues[currentIndex - 1] = '';
		} else {
			insertionStartIndex = currentIndex;
		}
		const totalCharsToInsert = clipboardText.length;

		// Check if any non-empty value exists before currentIndex
		const hasValuesBefore = this.inputValues.slice(0, currentIndex).some(Boolean);
		const startIndex = !hasValuesBefore ? 0 : insertionStartIndex;
		const endIndex = Math.min(this.numInputs, startIndex + totalCharsToInsert);

		for (let pos = startIndex; pos < endIndex; pos++) {
			if (clipboardText.length > 0) {
				const char = clipboardText.shift();
				this.inputValues[pos] = getValidInput(getInputType(this.inputType, pos), char) ?? '';
				this.setFocusIndex(Math.min(this.numInputs - 1, pos + 1));
			} else {
				break;
			}
		}
	}

	handleInputPaste(event, index, onPaste, restrictPaste) {
		this.#restrictPaste = restrictPaste;
		this._handle(event, index, onPaste);
	}
}