# Svelte OTP Input
<img src="https://svelte-otp-input-docs.pages.dev/_app/immutable/assets/svelte-otp-input-logo.CQBsPVGB.png" alt="Svelte OTP Input Logo" width="200" style="border-radius: 18px;">

[View Detailed Documentation](https://nithinkjoy.dev/docs/svelte-otp-input/basic-usage)

A flexible and customizable One-Time Password (OTP) input component for **Svelte 5+**. This component provides an easy-to-use solution for implementing OTP input fields in your Svelte applications with full support for customization and programmatic control.

## Features

- 🎯 **Flexible Input Types**: Support for numbers, text, passwords, and alphanumeric inputs and more
- 🎨 **Fully Customizable**: Control styles, separators, placeholders, and more
- 📱 **Mobile Optimized**: Auto-complete support and mobile-friendly interactions
- ♿ **Accessible**: ARIA labels and keyboard navigation support
- 🎭 **Error States**: Built-in error styling and validation
- 🔒 **Paste Protection**: Optional paste restriction for flexibility
- 📦 **Grouping Support**: Group inputs with custom separators
- 🎪 **Snippet Support**: Use Svelte 5 snippets for custom separators

## Installation

```bash
npm install svelte-otp-input
```

## Basic Usage

```svelte
<script>
  import OtpInput from 'svelte-otp-input';
  
  let value = $state("");
</script>

<OtpInput
  bind:value
  numInputs={4}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `numInputs` | `number` | Number of OTP input boxes (must be a positive integer) |
| `value` | `string` | `""` | The OTP value (bindable) |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputType` | `string` | `"number"` | Input type: `"number"`, `"text"`, `"password"`, `"upper-alnum"`, `"uppercase"` |
| `separator` | `string \| string[] \| snippet` | `"-"` | Character(s) between inputs |
| `groupSeparator` | `string \| snippet` | `"  "` | Separator between groups |
| `group` | `number[]` | `null` | Array defining input grouping (e.g., `[3, 3]` for 6 inputs) |
| `shouldAutoFocus` | `boolean` | `true` | Auto-focus first input on mount |
| `placeholder` | `string` | `""` | Placeholder text for inputs |
| `isError` | `boolean` | `false` | Show error state styling |
| `isDisabled` | `boolean` | `false` | Disable all inputs |
| `restrictPaste` | `boolean` | `false` | Prevent paste functionality |

### Styling Props

| Prop | Type                                                             | Default | Description |
|------|------------------------------------------------------------------|---------|-------------|
| `containerStyle` | `tailwind style \| object`                                       | `""` | Styles for the container |
| `inputStyles` | `tailwind style \| object \| Array(tailwind style \| object) \| svelte global styling` | `""` | Styles for input boxes |
| `inputFocusStyle` | `tailwind style \| object \| object)`     | `""` | Styles when input is focused |
| `inputErrorStyle` | `tailwind style \| object \| Array(tailwind style \| object)`    | `""` | Styles when `isError` is true |
| `inputDisabledStyle` | `tailwind style \| object \| Array(tailwind style \| object)`    | `""` | Styles when inputs are disabled |
| `placeholderStyle` | `string \| object`                                               | `""` | Styles for placeholder text |
| `stylePriority` | `object`                                                         | See below | Control style precedence |

**Default Style Priority:**
```javascript
{
  inputDisabledStyle: 'p0',
  inputErrorStyle: 'p1',
  inputFocusStyle: 'p2'
}
```

### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `(value: string) => void` | Called when all inputs are filled |
| `onEnter` | `(value: string) => void` | Called when Enter key is pressed |
| `onInput` | `(event, index) => void` | Called on input change |
| `onFocus` | `(event, index) => void` | Called when input receives focus |
| `onBlur` | `(event, index) => void` | Called when input loses focus |
| `onPaste` | `(event, index) => void` | Called on paste event |
| `keyDown` | `(event, index) => void` | Called on key down |

### Advanced Props

| Prop | Type | Description |
|------|------|-------------|
| `inputRef` | `Array` | Pass your own `$state(Array(numInputs).fill(null))` for input refs |

## Examples

### Basic 4-Digit OTP

```svelte
<script>
  import OtpInput from 'svelte-otp-input';
  
  let otp = $state("");
</script>

<OtpInput
  bind:value={otp}
  numInputs={4}
/>
```

### 6-Digit OTP with Grouping

```svelte
<OtpInput
  bind:value={otp}
  numInputs={6}
  group={[3, 3]}
  groupSeparator="—"
/>
```

### Custom Styling

```svelte
<OtpInput
  bind:value={otp}
  numInputs={4}
  containerStyle={{
    gap: '16px',
    padding: '20px'
  }}
  inputStyles={{
    width: '60px',
    height: '60px',
    fontSize: '24px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0'
  }}
  inputFocusStyle={{
    border: '2px solid #4CAF50',
    boxShadow: '0 0 8px rgba(76, 175, 80, 0.3)'
  }}
/>
```

### With Error State

```svelte
<script>
  let otp = $state("");
  let hasError = $state(false);
  
  function handleComplete(value) {
    if (value !== "1234") {
      hasError = true;
    } else {
      hasError = false;
      console.log("Correct OTP!");
    }
  }
</script>

<OtpInput
  bind:value={otp}
  numInputs={4}
  isError={hasError}
  onComplete={handleComplete}
/>
```

### Password Input Type

```svelte
<OtpInput
  bind:value={otp}
  numInputs={6}
  inputType="password"
/>
```

### With Custom Separators (Array)

```svelte
<OtpInput
  bind:value={otp}
  numInputs={5}
  separator={['-', '-', ' ', '-']}
/>
```

### Uppercase Letters Only

```svelte
<OtpInput
  bind:value={otp}
  numInputs={4}
  inputType="uppercase"
/>
```

### Access Input References

```svelte
<script>
  let otp = $state("");
  let inputRefs = $state(Array(6).fill(null));
  
  function focusThirdInput() {
    inputRefs[2]?.focus();
  }
</script>

<OtpInput
  bind:value={otp}
  numInputs={6}
  inputRef={inputRefs}
/>

<button onclick={focusThirdInput}>
  Focus 3rd Input
</button>
```

## Input Types

- `"number"`: Numeric input only (0-9)
- `"text"`: Any text input
- `"password"`: Masked input
- `"upper-alnum"`: Uppercase alphanumeric
- `"uppercase"`: Uppercase letters only
- `"lower-alnum"`: Lowercase alphanumeric
- `"lowercase"`: Lowercase letters only
- `"alnum"`: Alphanumeric values
- `"Custom Regex"`: We can specify custom Regex

## Keyboard Navigation

- **Left/Right Arrow**: Navigate between inputs
- **Backspace**: Delete current character and move to previous input
- **Tab**: Move to next input (or next form element)
- **Enter**: Trigger `onEnter` callback
- **Paste**: Auto-fill all inputs (unless `restrictPaste` is true)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires Svelte 5+

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
