<script module>
	export const stateData = {};

	export function setData(data) {
		stateData.data = data;
	}
</script>

<script>
	import { onMount } from 'svelte';
	import {
		setValue,
		getInputType,
		isSnippet,
		styleObjectToString,
		getCSS
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
		separator = '.',
		groupSeparator = '  ',
		shouldAutoFocus = false,
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

	let focusIndex = $state(0);
	let inputValues = $state(Array(numInputs).fill(''));
	let inputRefs = getStatefulArray(inputRef, numInputs);
	let scopedClass = $state('');

	setData({ inputValues, numInputs, inputType });

	const setFocusIndex = (i) => (focusIndex = i);

	export const internal = {
		get focusIndex() {
			return focusIndex;
		},
		inputValues,
		setFocusIndex,
		inputRefs,
		setValue
	};

	const onInputInstance = new OnInputClass({ numInputs, setFocusIndex });
	const onFocusInstance = new OnFocusClass({
		inputRefs,
		inputFocusStyle,
		setFocusIndex,
		stylePriority,
		isError
	});
	const onBlurInstance = new OnBlurClass({ inputRefs, inputFocusStyle });
	const onPasteInstance = new OnPasteClass({ numInputs, inputValues, setFocusIndex, inputType });
	const keyDownInstance = new KeyDownClass({
		numInputs,
		inputRefs,
		setFocusIndex,
		onInputInstance,
		onFocusInstance,
		inputType,
		onEnter,
		getValue: () => value
	});

	onMount(() => {
		if (shouldAutoFocus) focusIndex = 0;

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
		if (focusIndex !== null && inputRefs[focusIndex]) {
			setTimeout(() => {
				inputRefs[focusIndex]?.focus();
				inputRefs[focusIndex]?.select();
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
		value = inputValues.join('');
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
				<span>{sep}</span>
			{/if}
		{:else if isSnippet(sep)}
			{@render sep()}
		{:else}
			<span>{sep}</span>
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
		{@const ph = placeholder[index] || ''}
		{@const inputClass = getCSS(
			inputRefs,
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
				inputRefs,
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
			bind:this={inputRefs[index]}
			bind:value={
				() => inputValues[index],
				(v) => {
					inputValues[index] = v?.toString()?.substring(0, 1);
				}
			}
			disabled={isDisabled}
			autoComplete="off"
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

	.otp-input-lib-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
	}

	.single-otp-input {
		height: 60px;
		width: 60px;
		border-radius: 5px;
		text-align: center;
		font-size: 40px;
		line-height: 60px;
		margin: 0 12px;
		border: 2px solid #6f6e6c;
		box-sizing: border-box;
		-moz-appearance: textfield;
		appearance: textfield;
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
