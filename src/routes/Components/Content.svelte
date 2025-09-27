<script>
	import BasicUsage from '../OTPInputAPI/BasicUsage.svelte';
	import Bindvalue from '../OTPInputAPI/bindvalue.svelte';
	// Import all other components...

	let { activeContent } = $props()

	// Map content names to components
	const componentMap = {
		'Basic Usage': BasicUsage,
		'bind:value': Bindvalue,
	}

	// Get the current component based on activeContent
	let CurrentComponent = $derived(componentMap[activeContent])
	$inspect({ CurrentComponent })
</script>

{#if CurrentComponent}
<!--	<svelte:component this={CurrentComponent} />-->
	{@render CurrentComponent()}
{:else}
	<div>Component for "{activeContent}" not found</div>
{/if}