<script lang="ts">
	import type { SlDrawer } from '@shoelace-style/shoelace';

  const API_URL = import.meta.env.VITE_API_URL;

  type Props = {
    drawerRef: SlDrawer | undefined,
    entityId: string | undefined,
    projectId: number | undefined,
    webFormsRef: HTMLElement | undefined,
  };

  let {
    drawerRef = $bindable(undefined),
    entityId,
    webFormsRef = $bindable(undefined),
    projectId
  }: Props = $props();

  let iframeRef: HTMLIFrameElement;

  // to-do: hide drawer upon succesful submission
  function handleSubmit(payload: any) {
    (async () => {
      if (!payload.detail) return;
      const url = `${API_URL}/submission?project_id=${projectId}`;
      var data = new FormData()
      data.append('submission_xml', await payload.detail[0].data.instanceFile.text());
      await fetch(url, {
        method: "POST",
        body: data
      });
    })();
  }

  $effect(() => {
    // we want to rerun this $effect function whenever a new iframe is rendered
    // because projectId and entityId are state keys that force a re-render below when they change
    // we add them here inside the $effect function, so Svelte knows that the function depends on them
    projectId;
    entityId;

    const intervalId = setInterval(() => {
      webFormsRef = iframeRef.contentDocument?.querySelector("odk-web-form") || undefined;
      if (webFormsRef) {
        clearInterval(intervalId);
        webFormsRef.addEventListener("submit", handleSubmit);
      }
    }, 100);
    // clear interval when re-run
    return () => {
      clearInterval(intervalId);
    };
  });
</script>

<style>
  #odk-web-forms-drawer::part(panel) {
    z-index: 11;
  }
  #odk-web-forms-drawer::part(body) {
    padding: 0;
  }
</style>

<hot-drawer
  id="odk-web-forms-drawer"
  bind:this={drawerRef}
  contained
  placement="start"
  class="drawer-contained drawer-placement-start drawer-overview"
  style="--size: 100vw; --header-spacing: 0px"
>
  {#key projectId}
    {#key entityId}
      <iframe
        bind:this={iframeRef}
        title="odk-web-forms-wrapper"
        src={`./web-forms.html?projectId=${projectId}&entityId=${entityId}&api_url=${API_URL}`}
        style="height: {window.outerHeight}px; width: 100%; z-index: 11;"
      >
      </iframe>  
    {/key} 
  {/key}
</hot-drawer>