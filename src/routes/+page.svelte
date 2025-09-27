<script>
	import SideBar from './Components/SideBar.svelte';
	import Content from './Components/Content.svelte';

	let activeContent = $state('Basic Usage');
</script>

<div class="docs-page">
	<SideBar bind:activeContent={activeContent} />
	<Content activeContent={activeContent}/>
</div>

<style>
	.docs-page {
			display: flex;
			flex-direction: row;
	}
</style>
