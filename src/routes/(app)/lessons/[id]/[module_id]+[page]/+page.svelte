<script>
   import {page} from "$app/stores";

    export let data;

    let displayedContent;

    $: displayedContent = data.content[parseInt($page.params.page) - 1];
</script>

<main>
    <h1>{data.moduleTitle}</h1>
    <div class="module-content">
        {@html displayedContent.context}
    </div>
    <a href="/lessons/{$page.params.id}/{data.moduleId}+{parseInt($page.params.page)-1}">back</a>
    <a href="/lessons/{$page.params.id}/{data.moduleId}+{parseInt($page.params.page)+1}">next</a>
</main>