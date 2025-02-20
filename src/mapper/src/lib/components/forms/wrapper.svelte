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

  function handleSubmit() {
    console.log("web forms was submitted");
  }

  // could probably set up a custom event to be dispatched from the iframe
  // and just listen for that event vs. polling, ... idk
  $effect(() => {
    let intervalId = setInterval(() => {
      webFormsRef = iframeRef.contentDocument?.querySelector("odk-web-form") || undefined;
      if (webFormsRef) {
        console.log("webFormsRef:", webFormsRef);
        clearInterval(intervalId);

        // set up event listener
        webFormsRef.addEventListener("submit", handleSubmit);
      }
    }, 100);
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
