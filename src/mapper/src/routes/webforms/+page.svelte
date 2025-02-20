<svelte:head>
  <script src="https://danieljdufour.com/web-forms-web-component/odk-web-form.js" type="module"></script>
</svelte:head>


<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from '../$types';
  import { page } from '$app/stores';

  const API_URL = import.meta.env.VITE_API_URL;

  console.log("in frame page is:", page);

	interface Props {
		data: PageData;
	}

  // to-do: can probably but loading overview on top of odk-web-form web component
  let loading = $state(true);

  // let { data }: Props = $props();

  // accessing data attribute on iframe containing this page;
  // const entityId = window.frameElement?.getAttribute("data-entity-id");
  const entityId = new URL(window.location.href).searchParams.get("entityId");
  console.log("got entityId from parent iframe:", { entityId });

  // const projectId = window.frameElement?.getAttribute("data-project-id");
  const projectId = new URL(window.location.href).searchParams.get("projectId");
  console.log("got projectId from parent iframe:", { projectId });

  // : Props = $props();
  // import { expose } from 'microlink';

  // console.log("expose:", expose);
  // // install microlink and expose following functions:
  // // reset, save

  // const reset = ({ formXml }) => {
  //   console.log("resetting form with xml", formXml);
  // };

  // expose({
  //   reset
  // });
  // console.log("OdkWebForm:", OdkWebForm);

  console.log("form-xml:", [`${API_URL}/projects/${projectId}/form-xml`]);

  // @ts-ignore
  window.fetchFormAttachment = function fetchFormAttachment (url: string) {
    url = url.toString();
    if (url === "jr://file-csv/features.csv") {
      const csv = `"name","label"\n"${entityId || ""}","${entityId || ""}"`;
      return (async () => ({
        status: 200,
        text: async () => csv
      }))();
    } else if (url === "jr://instance/last-saved") {
      return (async () => ({
        status: 404
      }))();
    } else {
      return fetch(url);
    }
  }
  
  onMount(function () {
    // should use ref
    const webForm = document.querySelector("odk-web-form");
    if (webForm) {
      webForm.fetchFormAttachment = fetchFormAttachment;

      webForm.addEventListener("submit", evt => {
        console.log("on submit");
      });
    }
  });
</script>

<div id="webforms-page" style="height: 100vh; overflow-y: scroll; position: relative;">
  <odk-web-form
    form-xml={`${API_URL}/projects/${projectId}/form-xml`}
    missing-resource-behavior="BLANK"
  ></odk-web-form>
</div>

