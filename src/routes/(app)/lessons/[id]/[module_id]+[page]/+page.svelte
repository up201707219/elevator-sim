<script>
   import {page} from "$app/stores";
   import leftArrow from "$lib/assets/svg/left-arrow.svg";
   import rightArrow from "$lib/assets/svg/right-arrow.svg";
   import * as converter from "$lib/stringHtmlConverter";

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
    {#if !editMode}
    <div class="index-nav">
        <a href="/lessons">Cursos</a> / <a href="/lessons/{$page.params.id}">{data.courseTitle}</a>
    </div>
    <div class="container">
        <h1>{data.moduleTitle ?? ""}</h1>
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
        {:else}
        <div class="container">
            <h1>{data.moduleTitle ?? ""}</h1>
            <form method="POST" action="?/updateContent">
                <input type="hidden" name="module-id" value={data.moduleId}>
                <input type="hidden" name="content-id" value={displayedContent.id}>
                <label for="module-content">Conteúdo da página: </label>
                <textarea class="content-input" name="module-content" value={converter.htmlToString(displayedContent.context)}></textarea><br>
                <button class="module-submit content" type="submit">Guardar</button>
            </form>
            <form method="POST" action="?/insertContent">
                <input type="hidden" name="next-page" value={"/lessons/"+$page.params.id+"/"+data.moduleId+"+"+ data.content.length}>
                <input type="hidden" name="module-id" value={data.moduleId}>
                <button class="module-submit add-page" type="submit">nova página</button>
            </form>
        </div>
        <!-- <form action="?/deleteContent"></form> -->
    {/if}
    
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
        position: relative;
        margin-top: 3rem;
        font-size: 20pt;
        margin: 0rem 6rem;
        padding: 0 4rem;
        z-index: 1;
        border: 1px solid black;
        border-radius: 30px;
    }

    .index-nav{
        margin-left: 7rem ;
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
    .module-submit.content{
        margin-bottom: 1rem;
    }
    .module-submit.add-page{
        position: absolute;
        bottom: 1rem;
        right: 1rem;
    }
    /* .module-input{
        margin: 2rem 0;
        text-align: center;
        font: inherit;
        font-size: 30pt;
    } */
    .content-input{
        width: 90%;
        min-height: 16rem;
        margin-bottom: 2rem;
        font: inherit;
        resize: none;
    }
</style>