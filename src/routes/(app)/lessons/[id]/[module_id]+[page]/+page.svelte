<script>
   import {page} from "$app/stores";
   import leftArrow from "$lib/assets/svg/left-arrow.svg";
   import rightArrow from "$lib/assets/svg/right-arrow.svg";

    export let data;

    let editMode = false;

    let displayedContent;

    $: displayedContent = data.content[parseInt($page.params.page)];

    function toggleEdit(){
        editMode = !editMode;
    }
</script>

<main>
    <button class="edit-button" on:click={toggleEdit}>{editMode ? "Voltar" : "Editar"}</button>
    <div class="container">
        {#if !editMode} 
            <h1>{data.moduleTitle ?? ""}</h1>
        {:else}
            <form method="POST" action="">
                <input class="module-input" type="hidden" name="module-id" value={data.moduleId}>
                <label for="module-title">Nome do módulo: </label>
                <input class="module-input" type="text" name="module-title" value={data.moduleTitle}>
                <button class="module-submit" type="submit">guardar</button>
            </form>
        {/if}
            <div class="module-content">
                {@html displayedContent.context ?? ""}
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

    .edit-button{
        background-color: rgb(48, 209, 43);
        color: white;
        border-radius: 10px;
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
        padding: 5px 10px;
        cursor: pointer;
        margin:3rem 50% 0rem 50%;
    }
    .module-submit{
        background-color: rgb(48, 209, 43);
        color: white;
        border-radius: 10px;
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
        padding: 5px 10px;
        cursor: pointer;
    }
    .module-input{
        margin: 2rem 0;
        text-align: center;
        font: inherit;
    }
</style>