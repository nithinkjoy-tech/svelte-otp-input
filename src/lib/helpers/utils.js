import { stateData } from "../OtpInput/OtpInput.svelte"
export { internalInputRef as inputRef } from "../OtpInput/OtpInput.svelte"

export function setValue(values) {
	for (let i = 0; i < stateData.data.numInputs; i++) {
		stateData.data.inputValues[i] = getValidInput(getInputType(stateData.data.inputType, i), values[i]) ?? '';
	}
}

export function applyFocusStyle(el, style) {
	if(!el) return;

	el.dataset.prevStyle = el.style.cssText;
	el.dataset.prevClass = el.className;

	if (typeof style === "string") {
		// For tailwind type classes
		el.classList.add(...style.split(/\s+/).filter(Boolean));
	} else if (typeof style === "object" && style !== null) {
		// For inline style object
		Object.entries(style).forEach(([key, value]) => {
			el.style.cssText += `${key}:${value};`;
		});
	}
}

export function removeFocusStyle(el) {
	if(!el) return;

	if (el.dataset.prevStyle !== undefined) {
		el.style.cssText = el.dataset.prevStyle;
		delete el.dataset.prevStyle;
	}

	if (el.dataset.prevClass !== undefined) {
		el.className = el.dataset.prevClass;
		delete el.dataset.prevClass;
	}
}

export function getInputType(inputType, index) {
	if (typeof inputType === 'string') return inputType;
	if (Array.isArray(inputType)) return inputType[index] ?? 'text';
	return 'text';
}

export function getSortedKeysByPriority(stylePriority) {
	return Object.keys(stylePriority).sort(
		(a, b) => stylePriority[a].localeCompare(stylePriority[b])
	);
}

export function getCSS(
	inputRefs,
	isError,
	inputErrorStyle,
	isDisabled,
	inputDisabledStyle,
	inputStyles,
	stylePriority,
	index
) {
	const candidates = {
		inputErrorStyle: isError && inputErrorStyle
			? (Array.isArray(inputErrorStyle) ? inputErrorStyle[index] : inputErrorStyle)
			: null,

		inputDisabledStyle: isDisabled && inputDisabledStyle
			? (Array.isArray(inputDisabledStyle) ? inputDisabledStyle[index] : inputDisabledStyle)
			: null,

		inputStyles: inputStyles
			? (Array.isArray(inputStyles) ? inputStyles[index] : inputStyles)
			: null,
	};

	const sortedKeys = getSortedKeysByPriority(stylePriority);

	return {
		getInputClass() {
			let overrideClass = "";
			for (const key of sortedKeys) {
				if (key !== "inputStyles" && candidates[key]) {
					overrideClass = candidates[key];
					break;
				}
			}

			return [candidates.inputStyles, overrideClass].filter(Boolean).join(" ");
		},

		getInputStyles() {
			let finalStyle = { ...(candidates.inputStyles || {}) };

			for (const key of sortedKeys) {
				if (key !== "inputStyles" && candidates[key]) {
					finalStyle = { ...finalStyle, ...candidates[key] };
				}
			}

			return finalStyle;
		}
	};
}

export function styleObjectToString(styleObj = {}) {
	return Object.entries(styleObj)
		.map(([key, value]) => {
			const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			return `${cssKey}:${value}`;
		})
		.join("; ") + (Object.keys(styleObj).length ? ";" : "");
}

export function getInputFocusStyles(inputFocusStyle, index) {
	if (typeof inputFocusStyle === 'string') return inputFocusStyle;
	if (typeof inputFocusStyle === 'object') return styleObjectToString(inputFocusStyle);
	if (Array.isArray(inputFocusStyle)) {
		const item = inputFocusStyle[index];
		if (typeof item === 'string') return item;
		if (typeof item === 'object') return styleObjectToString(item || {});
	}

	throw new Error('inputFocusStyle must be a string / object or array of strings / objects')
}

export function isInvalidNumberKey(key) {
	// Returns true for any key that's not 0-9
	return /[^0-9]/.test(key);
}

// As of now svelte doesn't have an inbuilt way to determine whether it is a snippet or not
// still under discussion https://github.com/sveltejs/svelte/issues/9774
export function isSnippet(fn) {
	return typeof fn === 'function' && fn.toString !== Function.prototype.toString;
}

export function transformCase(e, input) {
	e.preventDefault();
	requestAnimationFrame(() => {
		const { selectionStart, selectionEnd, value } = e.target;
		const before = value.slice(0, selectionStart - 1);
		const after = value.slice(selectionEnd);
		e.target.value = before + input + after;
		e.target.setSelectionRange(selectionStart, selectionStart);
		e.target.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

export function isIphoneOrIpad() {
	const ua = navigator.userAgent || navigator.vendor || window.opera;

	// iPhone check
	if (/iPhone/i.test(ua)) return true;

	// iPad check (covers old iPads + new iPadOS that spoof as Mac)
	if (/iPad/i.test(ua)) return true;
	if (/Macintosh/i.test(ua) && "ontouchend" in document) return true;

	return false;
}

export function detectBrowser() {
	const userAgent = navigator.userAgent.toLowerCase();

	const isChrome = /chrome|chromium/.test(userAgent) && !/edg|opr|firefox/.test(userAgent);
	const isChromeIOS = /crios/.test(userAgent);
	const isSafari = /safari/.test(userAgent) && !/chrome|crios|chromium|edg|opr|firefox/.test(userAgent);

	return {
		isChrome: isChrome || isChromeIOS,  // Treat iOS Chrome as Chrome
		isSafari
	};
}

export function checkValidation(inputType, value) {
	if (typeof inputType === 'string') {
		switch (inputType) {
			case 'number':
				return !isInvalidNumberKey(value);

			case 'alnum':
				return /^[a-zA-Z0-9]$/.test(value);

			case 'uppercase':
			case 'lowercase':
				return /^[a-zA-Z]$/.test(value);

			case 'upper-alnum':
			case 'lower-alnum':
				return /^[a-zA-Z0-9]$/.test(value);

			case 'text':
			case 'password':
				return true;

			default:
				return false;
		}
	} else if (inputType instanceof RegExp) {
		return inputType.test(value);
	}

	return false;
}

export function getValidInput(inputType, value) {
	if (!checkValidation(inputType, value)) return '';
	if (inputType instanceof RegExp) return inputType.test(value) ? value : '';

	switch (inputType) {
		case 'uppercase':
		case 'upper-alnum':
			return value.toUpperCase();

		case 'lowercase':
		case 'lower-alnum':
			return value.toLowerCase();

		case 'number':
		case 'alnum':
		case 'text':
		case 'password':
			return value;

		default:
			return '';
	}
}

export function validateInput(e, index, _inputType = 'text') {
	const key = e.key;

	if (Array.isArray(_inputType)) {
		return validateInput(e, index, _inputType[index]);
	}

	if (_inputType instanceof RegExp) {
		if (!_inputType.test(key)) e.preventDefault();
		return;
	}

	if (typeof _inputType === 'string') {
		// allow Ctrl+V / Cmd+V for all input types
		if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'v') {
			return;
		}

		if (!checkValidation(_inputType, key)) {
			e.preventDefault();
			return;
		}

		const transformed = getValidInput(_inputType, key);
		if (transformed !== key) {
			transformCase(e, transformed);
		}
	}
}