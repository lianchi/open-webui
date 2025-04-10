<script lang="ts">
	import { onMount, tick } from 'svelte';

	export let value = '';
	export let placeholder = '';
	export let rows = 2;
	export let required = false;
	export let className = '';

	let textareaElement;

	const basicClass = 'w-full rounded-lg px-3 py-2 text-sm bg-gray-50 border border-gray-200 dark:border-gray-800 dark:text-gray-300 dark:bg-gray-850 outline-hidden h-full resize-none';

	// Adjust height on mount and after setting the element.
	onMount(async () => {
		await tick();
		resize();

		requestAnimationFrame(() => {
			// setInterveal to cehck until textareaElement is set
			const interval = setInterval(() => {
				if (textareaElement) {
					clearInterval(interval);
					resize();
				}
			}, 100);
		});
	});

	const resize = () => {
		if (textareaElement) {
			textareaElement.style.height = '';
			textareaElement.style.height = `${textareaElement.scrollHeight}px`;
		}
	};
</script>

<textarea
	bind:this={textareaElement}
	bind:value
	{placeholder}
	class={`${basicClass} ${className}`}
	{rows}
	{required}
	on:input={(e) => {
		resize();
	}}
	on:focus={() => {
		resize();
	}}
/>
