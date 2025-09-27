<script>
	let sideBarItems = [
		{ category: 'General', items: ['Basic Usage'] },
		{ category: 'Value & Binding', items: ['bind:value', 'bind:this', 'bind:inputRef'] },
		{ category: 'Layout & Structure', items: ['numInputs', 'group', 'groupSeparator', 'separator'] },
		{ category: 'Appearance & Styles', items: ['containerStyles', 'inputStyles', 'inputFocusStyle', 'inputErrorStyle', 'inputDisabledStyle', 'stylePriority'] },
		{ category: 'Behavior & Accessibility', items: ['shouldAutoFocus', 'placeholder', 'inputType', 'isError', 'isDisabled', 'restrictPaste'] },
		{ category: 'Events & Callbacks', items: ['onChange', 'onInput', 'onFocus', 'onBlur', 'onPaste', 'onComplete', 'onEnter', 'keyDown'] },
		{ category: 'Extras', items: ["Custom Event Ordering ([handler, 'after'])"] }
	];

	let { activeContent = $bindable() } = $props();
</script>

<div class="sidebar">
	<h2>OtpInput Library</h2>
	{#each sideBarItems as { category, items }}
		<div class="category">
			<h3>{category}</h3>
			<ul>
				{#each items as item}
					<li><a role="menuitem" tabindex="-1" class:active={activeContent === item} onclick={() => activeContent = item}>{item}</a></li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<style>
    .sidebar {
        width: 250px;
        height: 100vh;
        overflow-y: auto;
        background: #f8f9fa;
        padding: 20px;
        font-family: Arial, sans-serif;
    }
    .sidebar h2 {
        color: #6c757d;
        font-size: 16px;
        margin-bottom: 10px;
    }
    .sidebar ul {
        list-style: none;
        padding: 0;
    }
    .sidebar ul li {
        color: #6c757d;
        cursor: pointer;
    }
    .sidebar ul li a {
        width: 100%;
        display:inline-block;
        padding: 8px 0;
        text-decoration: none;
        color: #6c757d;
    }
    .sidebar ul li a.active {
        color: #6c33ff;
        background: linear-gradient(135deg, rgba(108, 51, 255, 0.2) 0%, rgba(108, 51, 255, 0.1) 100%);
        padding: 8px 0;
        padding-left: 8px;
        border-radius: 4px;
        display: block;
    }
    .category {
        margin-top: 15px;
    }
</style>