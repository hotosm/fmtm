<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { GeoJSON } from 'svelte-maplibre';
    import { getId, updatedSourceContext, addSource, removeSource } from 'svelte-maplibre';
    import type { Rect } from 'flatgeobuf';
    import type { GeoJSON as GeoJSONType } from 'geojson';
    import { fetchFlatGeobufData } from '$lib/utils/flatgeobuf';

    export let id: string = getId('flatgeobuf');
    export let url: string;
    export let bbox: Rect | null = null;
    export let promoteId: string | undefined = undefined;

    const { map, self: sourceId } = updatedSourceContext();
    let sourceObj: maplibregl.GeoJSONSource | undefined;
    let first = true;
    let geojsonData: GeoJSONType;

    // Declare a reactive variable for the sourceId
    let currentSourceId: string | undefined;

    // Subscribe to the sourceId store at the top level
    $: currentSourceId = $sourceId;

    // Fetch the GeoJSON data when component mounts
    onMount(async () => {
        geojsonData = await fetchFlatGeobufData(url, bbox);
        if (geojsonData) {
            // Set a unique source ID
            currentSourceId = id;
            addSourceToMap();
        }
    });

    // TODO
    // TODO add code to make bbox reactive and update the geojsonData
    // TODO

    function addSourceToMap() {
        if (!$map) return;

        const initialData = {
            type: 'geojson',
            data: geojsonData,
            promoteId
        };

        // Use the currentSourceId in addSource
        addSource($map, currentSourceId, initialData, (sourceId) => sourceId === currentSourceId, () => {
            sourceObj = $map?.getSource(currentSourceId) as maplibregl.GeoJSONSource;
            first = true;
        });
    }

    // Update data only if source already exists
    $: if (sourceObj) {
        if (first) {
            first = false;
        } else {
            sourceObj.setData(geojsonData);
        }
    }

    // Clean up source when component is destroyed
    onDestroy(() => {
        if (sourceObj && $map) {
            removeSource($map, currentSourceId, sourceObj);
            currentSourceId = undefined;
            sourceObj = undefined;
        }
    });
</script>

<GeoJSON id={currentSourceId} data={geojsonData} promoteId={promoteId}>
    <slot />
</GeoJSON>
