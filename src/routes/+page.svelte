<script>
	import OtpInput from "$lib/index.js"

	let value = $state("");
</script>

<div id="app" class="otp-input">
	<OtpInput
		bind:value
		numInputs={4}
	></OtpInput>
</div>
