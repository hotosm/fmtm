<script lang="ts">
	import '@hotosm/ui/dist/style.css'
	import '@hotosm/ui/dist/components.js'

    export let data
</script>

<hot-header></hot-header>
<slot {data} />
