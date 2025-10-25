# Svelte OTP Input

[![npm version](https://badge.fury.io/js/svelte-otp-input.svg)](https://www.npmjs.com/package/svelte-otp-input)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/svelte-otp-input.svg)](https://www.npmjs.com/package/svelte-otp-input)

<img src="https://nithinkjoy.dev/docs/svelte-otp-input/_app/immutable/assets/svelte-otp-input-logo.xGFLpuMW.png" alt="Svelte OTP Input Logo" width="200">

A flexible and customizable One-Time Password (OTP) input component for **Svelte 5+**. Perfect for authentication flows, verification codes, 2FA (two-factor authentication), MFA (multi-factor authentication), PIN codes, and secure login experiences in your Svelte applications.

[📚 View Detailed Documentation](https://nithinkjoy.dev/docs/svelte-otp-input/basic-usage)

## Why Choose Svelte OTP Input?

Looking for a **Svelte 5 OTP component**, **verification code input**, or **2FA input field**? This package provides everything you need for modern authentication flows:

- ✅ **Svelte 5 Native**: Built specifically for Svelte 5+ with runes support ($state, $derived)
- ✅ **Zero Dependencies**: Lightweight and performant - no bloat
- ✅ **Production Ready**: Battle-tested in real-world applications
- ✅ **Mobile First**: Optimized for touch devices with SMS autocomplete support
- ✅ **Fully Accessible**: ARIA labels and complete keyboard navigation
- ✅ **Highly Customizable**: Style with Tailwind, CSS objects, or global styles

**Use Cases**: One-time passwords (OTP), email/SMS verification codes, two-factor authentication (2FA), multi-factor authentication (MFA), PIN code entry, secure access codes, payment verification, and more.

## Features

- 🎯 **Flexible Input Types**: Support for numbers, text, passwords, alphanumeric inputs, uppercase/lowercase, and custom regex patterns
- 🎨 **Fully Customizable**: Control styles, separators, placeholders, focus states, error states, and disabled states
- 📱 **Mobile Optimized**: Auto-complete support for SMS OTP codes and mobile-friendly interactions
- ♿ **Accessible**: WCAG compliant with ARIA labels and complete keyboard navigation support
- 🎭 **Error States**: Built-in error styling and validation with customizable error appearance
- 🔒 **Paste Protection**: Optional paste restriction for enhanced security
- 📦 **Grouping Support**: Group inputs with custom separators (e.g., 3-3 format for 6-digit codes)
- 🎪 **Snippet Support**: Use Svelte 5 snippets for fully custom separators
- 🎮 **Programmatic Control**: Access and control individual inputs via refs
- ⚡ **Lightweight**: Minimal bundle size impact on your application

## Installation

```bash
npm install svelte-otp-input
```

```bash
pnpm add svelte-otp-input
```

```bash
yarn add svelte-otp-input
```

## Quick Start

Get up and running in seconds:

```svelte
<script>
  import OtpInput from 'svelte-otp-input';
  
  let code = $state("");
</script>

<OtpInput 
  bind:value={code} 
  numInputs={6}
  onComplete={(otp) => {
    console.log('OTP entered:', otp);
    // Verify OTP with your backend
  }}
/>
```

That's it! See the [full documentation](https://nithinkjoy.dev/docs/svelte-otp-input/basic-usage) for advanced features and customization options.

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `numInputs` | `number` | Number of OTP input boxes (must be a positive integer) |
| `value` | `string` | The OTP value (bindable with `bind:value`) |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputType` | `string` | `"number"` | Input type: `"number"`, `"text"`, `"password"`, `"upper-alnum"`, `"uppercase"`, `"lower-alnum"`, `"lowercase"`, `"alnum"`, or custom regex |
| `separator` | `string \| string[] \| snippet` | `"-"` | Character(s) or snippet between inputs |
| `groupSeparator` | `string \| snippet` | `"  "` | Separator between groups (when using `group` prop) |
| `group` | `number[]` | `null` | Array defining input grouping (e.g., `[3, 3]` for 6 inputs split into two groups) |
| `shouldAutoFocus` | `boolean` | `true` | Auto-focus first input on component mount |
| `placeholder` | `string` | `""` | Placeholder text for empty inputs |
| `isError` | `boolean` | `false` | Show error state styling |
| `isDisabled` | `boolean` | `false` | Disable all inputs |
| `restrictPaste` | `boolean` | `false` | Prevent paste functionality for enhanced security |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `containerStyle` | `string \| object` | `""` | Styles for the container wrapper |
| `inputStyles` | `string \| object \| Array<string \| object>` | `""` | Styles for input boxes (supports Tailwind classes, CSS objects, or global styles) |
| `inputFocusStyle` | `string \| object` | `""` | Styles applied when input is focused |
| `inputErrorStyle` | `string \| object \| Array<string \| object>` | `""` | Styles applied when `isError` is true |
| `inputDisabledStyle` | `string \| object \| Array<string \| object>` | `""` | Styles applied when inputs are disabled |
| `placeholderStyle` | `string \| object` | `""` | Styles for placeholder text |
| `stylePriority` | `object` | See below | Control which styles take precedence |

**Default Style Priority:**
```javascript
{
  inputDisabledStyle: 'p0', // Highest priority
  inputErrorStyle: 'p1',
  inputFocusStyle: 'p2'     // Lowest priority
}
```

### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onComplete` | `(value: string) => void` | Called when all inputs are filled |
| `onEnter` | `(value: string) => void` | Called when Enter key is pressed |
| `onInput` | `(event, index) => void` | Called on input change for each character |
| `onFocus` | `(event, index) => void` | Called when an input receives focus |
| `onBlur` | `(event, index) => void` | Called when an input loses focus |
| `onPaste` | `(event, index) => void` | Called on paste event |
| `keyDown` | `(event, index) => void` | Called on key down event |

### Advanced Props

| Prop | Type | Description |
|------|------|-------------|
| `inputRef` | `Array` | Pass your own `$state(Array(numInputs).fill(null))` to access input element references |

## Examples

### Basic 4-Digit OTP

Perfect for simple verification codes:

```svelte
<script>
  import OtpInput from 'svelte-otp-input';
  
  let otp = $state("");
</script>

<OtpInput
  bind:value={otp}
  numInputs={4}
  placeholder="0"
/>
```

### 6-Digit OTP with Grouping

Commonly used for SMS verification and 2FA:

```svelte
<script>
  let otp = $state("");
</script>

<OtpInput
  bind:value={otp}
  numInputs={6}
  group={[3, 3]}
  groupSeparator="—"
/>

<p>Entered OTP: {otp}</p>
```

### Custom Styling with Tailwind

Create a beautiful, modern OTP input:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={4}
  containerStyle="flex gap-4 justify-center py-8"
  inputStyles="w-14 h-14 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg"
  inputFocusStyle="border-blue-500 ring-2 ring-blue-200 outline-none"
  inputErrorStyle="border-red-500 bg-red-50"
/>
```

### Custom Styling with CSS Objects

For precise control over appearance:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={4}
  containerStyle={{
    gap: '16px',
    padding: '20px',
    justifyContent: 'center'
  }}
  inputStyles={{
    width: '60px',
    height: '60px',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#ffffff'
  }}
  inputFocusStyle={{
    border: '2px solid #4CAF50',
    boxShadow: '0 0 8px rgba(76, 175, 80, 0.3)',
    outline: 'none'
  }}
/>
```

### With Error State and Validation

Validate OTP and show errors:

```svelte
<script>
  import OtpInput from 'svelte-otp-input';
  
  let otp = $state("");
  let hasError = $state(false);
  let isVerifying = $state(false);
  
  async function handleComplete(value) {
    isVerifying = true;
    
    // Simulate API call
    const isValid = await verifyOTP(value);
    
    if (!isValid) {
      hasError = true;
      // Reset after showing error
      setTimeout(() => {
        otp = "";
        hasError = false;
      }, 2000);
    } else {
      hasError = false;
      console.log("OTP verified successfully!");
    }
    
    isVerifying = false;
  }
  
  async function verifyOTP(code) {
    // Your verification logic
    return code === "123456";
  }
</script>

<OtpInput
  bind:value={otp}
  numInputs={6}
  isError={hasError}
  isDisabled={isVerifying}
  onComplete={handleComplete}
  inputErrorStyle="border-red-500 bg-red-50 text-red-900"
/>

{#if hasError}
  <p class="text-red-500 mt-2">Invalid OTP. Please try again.</p>
{/if}

{#if isVerifying}
  <p class="text-gray-500 mt-2">Verifying...</p>
{/if}
```

### Password Input Type

For secure PIN entry:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={6}
  inputType="password"
  placeholder="•"
/>
```

### With Custom Separators (Array)

Different separators between inputs:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={5}
  separator={['-', '-', ' ', '-']}
/>
<!-- Renders as: X-X-X X-X -->
```

### Uppercase Letters Only

For alphabetic verification codes:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={4}
  inputType="uppercase"
  placeholder="A"
/>
```

### Alphanumeric Input

For mixed character codes:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={8}
  inputType="alnum"
  group={[4, 4]}
  groupSeparator=" - "
/>
```

### Access Input References

Programmatically control inputs:

```svelte
<script>
  import OtpInput from 'svelte-otp-input';
  
  let otp = $state("");
  let inputRefs = $state(Array(6).fill(null));
  
  function focusThirdInput() {
    inputRefs[2]?.focus();
  }
  
  function clearAndFocusFirst() {
    otp = "";
    inputRefs[0]?.focus();
  }
</script>

<OtpInput
  bind:value={otp}
  numInputs={6}
  inputRef={inputRefs}
/>

<div class="mt-4 space-x-2">
  <button onclick={focusThirdInput}>
    Focus 3rd Input
  </button>
  <button onclick={clearAndFocusFirst}>
    Clear & Reset
  </button>
</div>
```

### With Enter Key Handler

Submit on Enter key press:

```svelte
<script>
  let otp = $state("");
  
  function handleEnter(value) {
    if (value.length === 6) {
      console.log("Submitting OTP:", value);
      // Submit to your backend
    }
  }
</script>

<OtpInput
  bind:value={otp}
  numInputs={6}
  onEnter={handleEnter}
/>

<p class="text-sm text-gray-500 mt-2">
  Press Enter to submit
</p>
```

### Disable Paste for Security

Prevent users from pasting codes:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={6}
  restrictPaste={true}
/>

<p class="text-sm text-gray-500 mt-2">
  Please enter each digit manually
</p>
```

## Input Types

The component supports various input types for different use cases:

| Type | Description | Allowed Characters | Example |
|------|-------------|-------------------|---------|
| `"number"` | Numeric only | 0-9 | `1234` |
| `"text"` | Any text | All characters | `abcd` |
| `"password"` | Masked input | All characters | `••••` |
| `"upper-alnum"` | Uppercase alphanumeric | A-Z, 0-9 | `A1B2` |
| `"uppercase"` | Uppercase letters only | A-Z | `ABCD` |
| `"lower-alnum"` | Lowercase alphanumeric | a-z, 0-9 | `a1b2` |
| `"lowercase"` | Lowercase letters only | a-z | `abcd` |
| `"alnum"` | Alphanumeric (any case) | a-z, A-Z, 0-9 | `Ab12` |
| Custom Regex | Custom pattern | Defined by your regex | Variable |

### Using Custom Regex

```svelte
let regex = ^[A-F0-9]$

<OtpInput
  bind:value={otp}
  numInputs={4}
  inputType={regex}
/>
<!-- Only accepts hexadecimal characters -->
```

## Keyboard Navigation

Full keyboard support for accessibility:

- **Left Arrow / Right Arrow**: Navigate between inputs
- **Backspace**: Delete current character and move to previous input
- **Tab / Shift+Tab**: Move to next/previous input or form element
- **Enter**: Trigger `onEnter` callback
- **Paste (Ctrl+V / Cmd+V)**: Auto-fill all inputs from clipboard (unless `restrictPaste` is enabled)
- **Number keys**: Direct input of digits

## Styling Guide

### Using Tailwind CSS Classes

```svelte
<OtpInput
  bind:value={otp}
  numInputs={6}
  containerStyle="flex gap-3 p-6 bg-gray-50 rounded-xl"
  inputStyles="w-12 h-12 text-xl font-semibold text-center border-2 border-gray-300 rounded-lg transition-all duration-200"
  inputFocusStyle="border-blue-500 ring-4 ring-blue-100 scale-105"
  inputErrorStyle="border-red-500 bg-red-50"
/>
```

### Using CSS Objects

```svelte
<OtpInput
  bind:value={otp}
  numInputs={4}
  inputStyles={{
    width: '3rem',
    height: '3rem',
    fontSize: '1.5rem',
    textAlign: 'center',
    border: '2px solid #e5e7eb',
    borderRadius: '0.5rem',
    transition: 'all 0.2s'
  }}
  inputFocusStyle={{
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  }}
/>
```

### Using Global CSS (with :global())

```svelte
<OtpInput
  bind:value={otp}
  numInputs={6}
  inputStyles="otp-input"
/>

<style>
  :global(.otp-input) {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
    text-align: center;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }
  
  :global(.otp-input:focus) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
  }
</style>
```

## Frequently Asked Questions

### Does this work with Svelte 5?

Yes! This component is built specifically for Svelte 5+ using modern runes ($state, $derived, etc.). It will not work with Svelte 4 or earlier versions.

### Can I use this for SMS verification codes?

Absolutely! The component supports mobile SMS autocomplete. On supported mobile browsers, users can tap to auto-fill the OTP from incoming SMS messages.

### Is it accessible?

Yes! The component includes:
- Proper ARIA labels for screen readers
- Full keyboard navigation support
- Focus management
- High contrast support
- Keyboard-only operation

### Can I customize the styling?

Completely! You can use:
- Tailwind CSS utility classes
- Global CSS with the `:global()` modifier
- Mix and match different styling approaches

### How do I validate the OTP?

Use the `onComplete` callback to validate when all digits are entered:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={6}
  onComplete={async (code) => {
    const isValid = await verifyWithBackend(code);
    if (!isValid) {
      // Handle invalid OTP
    }
  }}
/>
```

### Can I clear the OTP programmatically?

Yes! Simply bind the value and reset it:

```svelte
<script>
  import OtpInput, { setValue } from 'svelte-otp-input'

  let otp = $state("");
  
  function clearOTP() {
    setValue("")
  }
</script>

<OtpInput bind:value={otp} numInputs={6} />
<button onclick={clearOTP}>Clear</button>
```

### Does it work on mobile devices?

Yes! The component is fully mobile-optimized with:
- Touch-friendly input sizes
- Native keyboard support (numeric, text, etc.)
- SMS autocomplete on supported devices
- Responsive design

### How do I handle paste events?

By default, pasting is enabled and will auto-fill all inputs. To disable:

```svelte
<OtpInput
  bind:value={otp}
  numInputs={6}
  restrictPaste={true}
/>
```

You can also use the `onPaste` callback to customize paste behavior.

### Can I use custom separators?

Yes! You can use:
- Single character: `separator="-"`
- Array of separators: `separator={['-', '-', ' ', '-']}`
- Svelte snippet: `separator={customSnippet}`

### How do I create a PIN code input?

```svelte
<OtpInput
  bind:value={pin}
  numInputs={4}
  inputType="password"
  placeholder="•"
/>
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Modern browsers with ES2020+ support

**Requirements**: Svelte 5+

## Contributing

Contributions are welcome! Here's how you can help:

1. 🐛 **Report bugs**: Open an issue with details and reproduction steps
2. 💡 **Suggest features**: Share your ideas in discussions
3. 🔧 **Submit PRs**: Fork, create a feature branch, and submit a pull request
4. 📖 **Improve docs**: Help make the documentation better
5. ⭐ **Star the repo**: Show your support!

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/svelte-otp-input.git

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## License

MIT © [Your Name]

See [LICENSE](./LICENSE) for details.

## Support

- 📚 [Documentation](https://nithinkjoy.dev/docs/svelte-otp-input/basic-usage)
- 🐛 [Issue Tracker](https://github.com/nithinkjoy-tech/svelte-otp-input/issues)
- 📧 [Email Support](mailto:nithinkjoy1@gmail.com)

## Acknowledgments

Built with ❤️ for the Svelte community.

---

**Keywords**: svelte otp, svelte 5 otp input, svelte verification code, svelte 2fa input, svelte mfa, svelte pin code, svelte authentication component, one-time password svelte, verification input svelte, svelte security input, svelte otp component, two-factor authentication svelte, multi-factor authentication svelte, svelte sms verification, svelte code input

**Made for Svelte 5+ | Zero Dependencies | Production Ready**