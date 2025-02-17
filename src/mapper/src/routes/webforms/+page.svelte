<svelte:head>
  <script src="https://danieljdufour.com/web-forms-web-component/odk-web-form.js" type="module"></script>
</svelte:head>

<script lang="ts">
  import type { PageData } from '../$types';
  import { page } from '$app/stores';

  const API_URL = import.meta.env.VITE_API_URL;

  console.log("in frame page is:", page);

	interface Props {
		data: PageData;
	}

  // let { data }: Props = $props();

  // accessing data attribute on iframe containing this page;
  const projectId = window.frameElement?.getAttribute("data-project-id");
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
  console.log("form-xml:", [`${API_URL}/projects/${projectId}/form-xml`]);
</script>

<div style="height: 500px; overflow-y: scroll">
  <odk-web-form form-xml={`${API_URL}/projects/${projectId}/form-xml`}></odk-web-form>
</div>

