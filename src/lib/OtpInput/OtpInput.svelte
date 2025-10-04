<script module>
	export const stateData = {};
	export let internalInputRef = [];

	export function setData(data) {
		stateData.data = data;
		internalInputRef = data.inputRefs;
	}
</script>

<script>
	import { onMount } from 'svelte';
	import {
		setValue as _setValue,
		getInputType,
		isSnippet,
		styleObjectToString,
		getCSS,
		isIphoneOrIpad
	} from '../helpers/utils.js';

	import {
		OnInputClass,
		KeyDownClass,
		OnFocusClass,
		OnBlurClass,
		OnPasteClass
	} from '../helpers/eventHandlers.js';

	let {
		inputType = 'number',
		numInputs,
		separator = '-',
		groupSeparator = '  ',
		shouldAutoFocus = true,
		placeholder = '',
		group = null,
		isError = false,
		containerStyle = ``,
		inputStyles = ``,
		inputFocusStyle = ``,
		inputErrorStyle = ``,
		inputRef,
		value = '',
		keyDown,
		onInput,
		onFocus,
		onBlur,
		onPaste,
		onComplete,
		onEnter,
		restrictPaste = false,
		isDisabled = false,
		inputDisabledStyle = '',
		placeholderStyle = '',
		stylePriority = {
			inputDisabledStyle: 'p0',
			inputErrorStyle: 'p1',
			inputFocusStyle: 'p2'
		}
	} = $props();

	function getStatefulArray(inputRefs, numInputs) {
		if (inputRefs) {
			let refArr = $state.snapshot(inputRefs);
			if (Array.isArray(refArr) && refArr.length === numInputs) {
				return inputRefs;
			} else {
				console.error(
					'You have passed wrong inputRef type. We expect inputRef of type %c$state(Array(noOfInputs).fill(null))%c. Also check noOfInput used while creating inputRef',
					"font-family: monospace; background: #F5F8FA; color: #1F2328; font-weight: bold",
					"");
			}
		}

		// We give user to pass their own inputRef for more control, If inputRef is not passed, we create one internally
		// we cannot directly return $state() so we are assigning to a local variable
		let _inputRefs = $state(Array(numInputs).fill(null));
		return _inputRefs;
	}

	if(!numInputs) throw new Error("numInputs is required and should be of type positive integer.")
	if (typeof numInputs !== 'number' || numInputs < 1) {
		throw new Error('numInputs must be a positive integer');
	}

	if (typeof placeholder !== 'string') {
		throw new Error('placeholder must be a string');
	}

	let _focusIndex = $state(null);
	let _inputValues = $state(Array(numInputs).fill(''));
	let _inputRefs = getStatefulArray(inputRef, numInputs);
	let scopedClass = $state('');

	setData({ inputValues: _inputValues, numInputs, inputType, inputRefs: _inputRefs });

	const _setFocusIndex = (i) => (_focusIndex = i);

	export const inputValues = _inputValues;
	export const inputRefs = _inputRefs;
	export const setFocusIndex = _setFocusIndex;
	export const setValue = _setValue;
	export const focusIndex = {
		get current() {
			return _focusIndex;
		}
	};

	const onPasteInstance = new OnPasteClass({ numInputs, _inputValues, _setFocusIndex, inputType });
	const onInputInstance = new OnInputClass({ numInputs, _setFocusIndex, onPasteInstance });
	const onFocusInstance = new OnFocusClass({
		_inputRefs,
		inputFocusStyle,
		_setFocusIndex,
		stylePriority,
		isError
	});
	const onBlurInstance = new OnBlurClass({ _inputRefs, inputFocusStyle });
	const keyDownInstance = new KeyDownClass({
		numInputs,
		_inputRefs,
		_setFocusIndex,
		onInputInstance,
		onFocusInstance,
		inputType,
		onEnter,
		getValue: () => value
	});

	onMount(() => {
		// on iphone autofocus doesn't work without interaction
		if (shouldAutoFocus && !isIphoneOrIpad()) _focusIndex = 0;

		// generate client-only scoped class to avoid SSR/client mismatch
		if (!scopedClass) {
			const uid = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 8);
			scopedClass = `otp-input-scope-${uid}`;
		}
		// inject placeholder style and clean up on destroy
		let styleEl;
		if (typeof placeholderStyle === 'object') {
			styleEl = document.createElement('style');
			styleEl.textContent = `
				.${scopedClass} .single-otp-input::placeholder {
				 ${styleObjectToString(placeholderStyle)}
				}
   		`;
			document.head.appendChild(styleEl);
		}

		return () => {
			styleEl?.remove();
		};
	});

	$effect(() => {
		if (_focusIndex !== null && _inputRefs[_focusIndex]) {
			setTimeout(() => {
				_inputRefs[_focusIndex]?.focus();
				_inputRefs[_focusIndex]?.select();
			});
		}
	});

	$effect(() => {
		if (group) {
			if (!Array.isArray(group) || !group.every(n => Number.isInteger(n) && n > 0)) {
				throw new Error('Group must be an array of positive integers');
			}

			let groupSum = group.reduce((acc, curr) => acc + curr);
			if (groupSum !== numInputs) throw new Error('Sum of groups must be equal to numInputs');
		}
	});

	$effect(() => {
		value = _inputValues.join('');
	});

	$effect(() => {
		if (value.length === numInputs) {
			if (typeof onComplete === 'function') {
				onComplete(value);
			} else if (onComplete) {
				throw new Error('onComplete must be a function');
			}
		}
	});

	let groupHelper = $derived(() => {
		if (
			!group ||
			!Array.isArray(group) ||
			!group.every(Number.isInteger) ||
			group.reduce((sum, n) => sum + n, 0) !== numInputs
		) {
			return [];
		}
		return group.reduce((arr, n) => {
			arr.push((arr.at(-1) || 0) + n);
			return arr;
		}, []);
	});
</script>

{#snippet renderSeparator(index)}
	{@const validGroup = groupHelper().includes(index + 1)}
	{@const sep = Array.isArray(separator) ? separator[index] : separator}

	{#if index !== numInputs - 1}
		{#if validGroup}
			{#if groupSeparator}
				{#if isSnippet(groupSeparator)}
					{@render groupSeparator()}
				{:else}
					<span>{groupSeparator}</span>
				{/if}
			{/if}
		{:else if Array.isArray(separator)}
			{#if isSnippet(sep)}
				{@render sep()}
			{:else}
				<span class="otp-separator">{sep}</span>
			{/if}
		{:else if isSnippet(sep)}
			{@render sep()}
		{:else}
			<span class="otp-separator">{sep}</span>
		{/if}
	{/if}
{/snippet}

<div
	id="otp-input-lib-container"
	class={[`otp-input-lib-container ${scopedClass}`, typeof containerStyle === 'string' && containerStyle]}
	style={typeof containerStyle === 'object' ? styleObjectToString(containerStyle) : ''}
>
	{#each Array(numInputs).fill() as _, index}
		{@const type = getInputType(inputType, index)}
		{@const ph = placeholder.length === 1 ? placeholder[0] : placeholder[index] || ''}
		{@const inputClass = getCSS(
			_inputRefs,
			isError,
			inputErrorStyle,
			isDisabled,
			inputDisabledStyle,
			inputStyles,
			stylePriority,
			index
		).getInputClass()}

		{@const inputStyle = styleObjectToString(
			getCSS(
				_inputRefs,
				isError,
				inputErrorStyle,
				isDisabled,
				inputDisabledStyle,
				inputStyles,
				stylePriority,
				index
			).getInputStyles()
		)}

		<input
			id={`svelte-otp-inputbox-${index}`}
			class={['single-otp-input', inputClass, isError && 'otp-input-error', typeof placeholderStyle === 'string' && placeholderStyle]}
			style={inputStyle}
			type={(type==='password' || type === 'number') ? type : 'text'}
			inputmode={type === 'number' ? 'numeric' : 'text'}
			bind:this={_inputRefs[index]}
			bind:value={
				() => _inputValues[index],
				(v) => {
					_inputValues[index] = v?.toString()?.substring(0, 1);
				}
			}
			disabled={isDisabled}
			autocomplete={index === 0 ? 'one-time-code' : 'off'}
			autocapitalize={(type === 'upper-alnum' || type === 'uppercase') ? 'on' : 'off'}
			placeholder={ph}
			aria-label={`Please enter OTP character ${index + 1}`}
			onkeydown={(e) => keyDownInstance.handleKeyDown(e, index, keyDown)}
			oninput={(e) => onInputInstance.handleOnInput(e, index, onInput)}
			onfocus={(e) => onFocusInstance.handleInputFocus(e, index, onFocus)}
			onblur={(e) => onBlurInstance.handleInputBlur(e, index, onBlur)}
			onpaste={(e) => onPasteInstance.handleInputPaste(e, index, onPaste, restrictPaste)}
		/>
		{@render renderSeparator(index)}
	{/each}
</div>

<style>
	input:focus {
		outline: none;
	}

  input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px white inset !important; /* force background */
      box-shadow: 0 0 0 1000px white inset !important;
      -webkit-text-fill-color: #000 !important; /* keep text color consistent */
      transition: background-color 9999s ease-in-out 0s; /* prevents flashing */
  }

  /* Firefox */
  input:autofill {
      box-shadow: 0 0 0 1000px white inset !important;
      -webkit-text-fill-color: #000 !important;
  }

	.otp-input-lib-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
	}

	.single-otp-input {
      width: 50px;
      height: 48px;
      border: none;
      text-align: center;
      border-radius: 4px;
      font-size: 32px;
      line-height: 22px;
      color: #1e1e1e;
      border: 1px solid #1e1e1e;
      background-color: transparent;
      -moz-appearance: textfield;
	}

	.single-otp-input:focus {
			border: 2px solid #3173DC;
	}

	.otp-separator {
			margin: 0 8px;
	}

	.otp-input-error {
		border: 2px solid red;
	}

	.single-otp-input::-webkit-inner-spin-button,
	.single-otp-input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
