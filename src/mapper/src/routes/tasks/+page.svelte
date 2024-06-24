<script lang="ts">
    import { onMount } from 'svelte';
    import { initElectric } from '$lib/initElectric';
    import { type Electric } from '../../generated/client';
    import { createLiveQuery } from '$lib/liveQuery';
  
    let electric: Electric;
    let results;
  
    // Declare add function in the script scope
    const add = () => {
      electric.db.tasks_electric.create({
        data: {
          id: Math.floor(Math.random() * 1000),
          project_id: 1,
          project_task_index: Math.floor(Math.random() * 1000),
        },
      });
    };

    const deleteTasks = () => electric.db.tasks_electric.deleteMany()

    const lockTasks = async () => {
    try {
			const tasks = await electric.db.tasks_electric.findMany({
				where: { project_id: 1 }
			});
			const promises = tasks.map(task => {
				return electric.db.tasks_electric.update({
					where: { id: task.id },
					data: { task_status: 'LOCKED_FOR_MAPPING' }
				});
			});
			return await Promise.all(promises);
		} catch (err) {
			console.error('Error locking tasks:', err);
			throw err;
		}
    };

    const unlockTasks = async () => {
    try {
			const tasks = await electric.db.tasks_electric.findMany({
				where: { project_id: 1 }
			});
			const promises = tasks.map(task => {
				return electric.db.tasks_electric.update({
					where: { id: task.id },
					data: { task_status: 'READY' }
				});
			});
			return await Promise.all(promises);
		} catch (err) {
			console.error('Error unlocking tasks:', err);
			throw err;
		}
    };


onMount(async () => {
  electric = await initElectric();
  await electric.db.tasks_electric.sync();

  const query = electric.db.tasks_electric.liveMany({
    select: {id: true, project_task_index: true},
    where: {
      project_id: 1,
    },
  });
  results = createLiveQuery(electric.notifier, query);
});

  </script>
  
  <button on:click={add}>Add</button>
  <button on:click={deleteTasks}>clear</button>
  <button on:click={lockTasks}>lock</button>
  <button on:click={unlockTasks}>unlock</button>


  {#if $results}
    <div>
        {#each $results as r}
        <div>{r.id} {r.project_task_index} {r.task_status}</div>
        {/each}
    </div>
    {:else}
    <p>No tasks found.</p>
    {/if}
