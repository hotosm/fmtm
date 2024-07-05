<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import { type Electric } from '$lib/migrations'
  import { map, finish, validate, good, comment } from '$lib/task-events'
  import { createLiveQuery } from '$lib/live-query'

  export let data: PageData
  let electric: Electric = data.electric
  let history
  let comments

  onMount(async () => {
    await electric.db.task_history.sync()

    const taskHistory = electric.db.task_history.liveMany({
      select: { action_date: true, action: true },
      where: {
        project_id: 1,
      },
    })
    history = createLiveQuery(electric.notifier, taskHistory)

    const taskComments = electric.db.task_history.liveMany({
      select: { action_date: true, action_text: true },
      where: {
        project_id: 1,
        action: 'COMMENT',
      },
    })
    comments = createLiveQuery(electric.notifier, taskComments)
  })

  const formatDateString = (dateString: string): string => {
    const date = new Date(dateString)
    const day = ('0' + date.getDate()).slice(-2)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }
</script>

<main>
  <button on:click={() => { map(electric.db, 1, 1, 1) }}>Map</button>
  <button on:click={() => { finish(electric.db, 1, 1, 1) }}>Finish</button>
  <button on:click={() => { validate(electric.db, 1, 1, 1) }}>Validate</button>
  <button on:click={() => { good(electric.db, 1, 1, 1) }}>Good</button>
  <button on:click={() => { comment(electric.db, 1, 1, 1, 'A comment') }}>Comment</button>

  <p>History:</p>
  {#if $history}
    <div>
      {#each $history as r}
        <div>{formatDateString(r.action_date)} | {r.action}</div>
      {/each}
    </div>
  {:else}
    <p>No tasks found.</p>
  {/if}

  <p>Comments:</p>
  {#if $comments}
    <div>
      {#each $comments as r}
        <div>{formatDateString(r.action_date)} | {r.action_text}</div>
      {/each}
    </div>
  {:else}
    <p>No tasks found.</p>
  {/if}
</main>
