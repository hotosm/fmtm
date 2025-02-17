<script lang="ts">
	import type { SlDrawer } from '@shoelace-style/shoelace';

  type Props = {
    drawerRef: SlDrawer | undefined,    
    projectId: number | undefined,
    webFormsRef: HTMLElement | undefined,
  };

  let {
    drawerRef = $bindable(undefined),
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
  <iframe
    bind:this={iframeRef}
    title="odk-web-forms-wrapper"
    src="./webforms"
    style="height: {window.outerHeight}px; width: 100%; z-index: 11;"
    data-project-id={projectId}
  >
  </iframe>    
</hot-drawer>	
