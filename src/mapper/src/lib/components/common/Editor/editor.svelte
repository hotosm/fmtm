<script>
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Toolbar from './toolbar.svelte';
	import './editor.css';
	import '../../../../styles/button.css';

	let element;
	let editor;
	export let editable;
	export let content;
	export let setEditorHtmlContent;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			content: content,
			onTransaction: () => {
				editor = editor;
			},
			editable: editable,
			onUpdate: ({ editor }) => {
				setEditorHtmlContent && setEditorHtmlContent(editor.getHTML());
			},
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div>
	<div style={`border: ${editable ? '1px' : '0px'} solid #c2c2c2;`} class="rounded-md">
		{#if editor && editable}
			<Toolbar {editor} />
		{/if}

		<div class={`${editable ? 'h-[80px]' : 'h-full'}`}>
			<div bind:this={element} />
		</div>
	</div>
</div>

<style>
</style>
