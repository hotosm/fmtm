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

  function handleSubmit(payload: any) {
    (async () => {
      console.log("running handleSubmit with payload", payload);

      if (!payload.detail) return;

      const url = `${API_URL}/submission?project_id=${projectId}`;
      console.log("posting to url:", url);
      var data = new FormData()
      data.append('submission_xml', await payload.detail[0].data.instanceFile.text());

      const res = await fetch(url, {
        method: "POST",
        body: data
      });
      console.log(res);
    })();
  }

  // could probably set up a custom event to be dispatched from the iframe
  // and just listen for that event vs. polling, ... idk
  $effect(() => {
    // adding a reference to projectId and entityId to force a re-run
    // whenever a new iframe is rendered
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
        data-api-url={API_URL}
        data-project-id={projectId}
        data-entity-id={entityId}
      >
      </iframe>  
    {/key} 
  {/key}
</hot-drawer>	
