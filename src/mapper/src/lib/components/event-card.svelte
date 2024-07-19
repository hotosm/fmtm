<script lang="ts">
  import '@hotosm/ui/dist/components'
  import { createEventDispatcher } from 'svelte'
  import type { Task_history } from '$lib/migrations'
  
  export let record: Task_history;
  export let highlight: boolean;
  let highlightedStyle: string
	$: highlightedStyle = highlight ? 'bg-[var(--hot-secondary-light)]' : ''

  const dispatch = createEventDispatcher();
  function handleZoomToTask() {
    dispatch('zoomToTask', { taskId: record.task_id });
  }
</script>

<sl-card class={`flex gap-2 items-center justify-between px-1 border-b-[2px] border-white py-3 ${highlightedStyle}`}>
  <div class="flex items-center">
    <div class="w-[2.81rem] h-[2.81rem] border rounded-full overflow-hidden mr-4">
      {#if record?.profile_img}
        <img src={record?.profile_img} alt="Profile Picture" />
      {:else}
        <div class="w-full h-full flex justify-center items-center bg-white">
          <sl-icon name="person" style="font-size: 30px; color: green;"></sl-icon>
        </div>
      {/if}
    </div>
    <div class="text-base">
      <!-- <span class="text-[#555555] font-medium font-archivo">{record?.action_text} </span> -->
      <span class="text-[#555555] font-medium font-archivo">{record?.action} by {record.action_text?.split(' ').at(-1)}</span>
    
      <div class="flex items-center justify-between">
        <p class="font-archivo text-sm text-[#7A7676]">#{record?.task_id}</p>
        <div class="flex items-center mb-1">
          <sl-icon name="access_time" style="font-size: 20px; color: red;"></sl-icon>
        </div>
        <p class="font-archivo text-sm text-[#7A7676]">
          <span>{record?.action_date.toLocaleDateString()} </span>
          <span>{record?.action_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </p>
      </div>
    </div>
  </div>
  <div title="Zoom to Task" on:click={(e) => { e.stopPropagation(); handleZoomToTask() }}>
    <sl-icon name="map" class="text-[#9B9999] hover:text-[#555555] cursor-pointer" style="font-size: 20px;"></sl-icon>
  </div>
</sl-card>

<style>
  /* TODO replace with font for hotosm/ui shoelace css */
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@200;400;600&display=swap');
  
  .font-archivo {
    font-family: 'Archivo', sans-serif;
  }
</style>
