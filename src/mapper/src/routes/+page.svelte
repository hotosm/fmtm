<script lang="ts">
	import '@openlayers-elements/core/ol-map';
	import '@openlayers-elements/maps/ol-layer-openstreetmap';
	import '@hotosm/ui/components/Toolbar';
	import '@hotosm/ui/components/Tracking';
</script>

<hot-tracking site-id="28" domain="fmtm.hotosm.org"></hot-tracking>
<hot-toolbar></hot-toolbar>
<ol-map
	style="width: calc(100vw - 16px); height: 80vh; display: inline-block"
	zoom="7"
	lat="46.7985"
	lon="8.2318"
>
	<ol-layer-openstreetmap></ol-layer-openstreetmap>
</ol-map>
