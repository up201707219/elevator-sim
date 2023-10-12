<script>
   import {page} from "$app/stores";
   import leftArrow from "$lib/assets/svg/left-arrow.svg";
   import rightArrow from "$lib/assets/svg/right-arrow.svg";

    export let data;

    let displayedContent;

    $: displayedContent = data.content[parseInt($page.params.page)];
</script>

<main>
    <div class="container">     
        <h1>{data.moduleTitle}</h1>
        <div class="module-content">
            {@html displayedContent.context}
        </div>
    </div>

    <div class="nav-page">       
        {#if parseInt($page.params.page) > 0}
            <a href="/lessons/{$page.params.id}/{data.moduleId}+{parseInt($page.params.page)-1}">
                <img src={leftArrow} alt="back">
            </a>
        {:else}
            <span>
                <img class="inactive-nav" src={leftArrow} alt="back">
            </span>
        {/if}
        {#if parseInt($page.params.page) < data.content.length-1}
            <a href="/lessons/{$page.params.id}/{data.moduleId}+{parseInt($page.params.page)+1}">
                <img src={rightArrow} alt="next">
            </a>
        {:else}
            <span>
                <img class="inactive-nav" src={rightArrow} alt="next">
            </span>
        {/if}
    </div>
</main>

<style>
    :root{
        background-color: white;
        overflow-x: hidden;
    }
    h1{
        text-align: center;
    }
    .container{
        margin-top: 3rem;
        font-size: 20pt;
        margin: 3rem 6rem;
        padding: 0 4rem;
        z-index: 1;
        border: 1px solid black;
        border-radius: 30px;
    }

    .module-content{
        margin: auto;
    }

    .inactive-nav{
        filter: brightness(0) saturate(100%) invert(63%) sepia(1%) saturate(0%) hue-rotate(207deg) brightness(85%) contrast(95%);
    }

    .nav-page{
        display: flex;
        margin-top: auto;
        position: sticky;
        justify-content: space-between;
        padding: 0 3vw;
        width: 94vw;
        background-color: inherit;
        height: 100px;
        bottom: 0;
        left: 0;
        z-index: 2;
    }
</style>