<script>
   import {page} from "$app/stores";
   import closeIcon from "$lib/assets/svg/close_icon.svg";
   import * as converter from "$lib/stringHtmlConverter";

    export let data;

<<<<<<< HEAD
    let editMode = false;
=======
    let editMode = data.user.isAdmin !== "false";
>>>>>>> main

    let displayedContent;

    $: displayedContent = data.content[parseInt($page.params.page)];

    function toggleEdit(){
        editMode = !editMode;
    }
</script>

<main>
    <div class="top-close-bar">
        <a href="./" style="margin-right: 1rem;"><img class="close-lesson" src={closeIcon} alt="x"></a>
        <span>Módulo {parseInt($page.params.module_number) +1}: {data.moduleTitle}</span>
    </div>
<<<<<<< HEAD
    {#if data.user.isAdmin === "true"}
        <div class="admin-button">
            <button class="edit-button" on:click={toggleEdit}>{editMode ? "Voltar" : "Editar"}</button>
        </div>
    {/if}
=======
    <!-- {#if data.user.isAdmin === "true"}
        <div class="admin-button">
            <button class="edit-button" on:click={toggleEdit}>{editMode ? "Voltar" : "Editar"}</button>
        </div>
    {/if} -->
>>>>>>> main
    {#if !editMode}
    
        <div class="nav-pages">
            {#each data.content as content, i}
                <a data-sveltekit-reload href= {i<=$page.params.page? "/lessons/"+$page.params.id+"/"+$page.params.module_number+":"+data.moduleId+"+"+i : ""}>
                    <div class="page-opt">
                        <div class="subchapter {$page.params.page <= i ? "active":""}">
                            
                            <div class="subchapter-number {parseInt($page.params.page) >= i ? "active":""}">
                                <span>
                                    {i+1}
                                </span> 
                            </div>
                            <div class="subchapter-title">
                                {content.title}
                            </div>
                            
                        </div>
                    </div>
                </a>
            {/each}
        </div>
        <div class="container">
            <h1>Módulo {parseInt($page.params.module_number) +1}: {data.moduleTitle ?? ""}</h1>
            {#if parseInt($page.params.page) > 0}
            <a href="/lessons/{$page.params.id}/{$page.params.module_number}:{data.moduleId}+{parseInt($page.params.page)-1}">
                <div class="next-page back">
                    Voltar
                </div>
            </a>
            {/if}
            <div class="module-content">
                <h2>{parseInt($page.params.page)+1} - {displayedContent.title}</h2>
                <div class="module-text">
                    {@html displayedContent.context ?? ""}
                </div>
            </div>
        </div>
    
        
        {#if parseInt($page.params.page) < data.content.length-1}
            <a href="/lessons/{$page.params.id}/{$page.params.module_number}:{data.moduleId}+{parseInt($page.params.page)+1}">
                <div class="next-page">
                    Avançar
                </div>
            </a>
        {:else}
            <form method="post" action="?/finishModule">
                <input type="hidden" name="size" value={data.content.length}>
                <input type="hidden" name="completion" value={parseFloat(data.completion/data.content.length)}>
                <button class="next-page" type="submit">
                    Concluir
                </button>
            </form>
        {/if}
    {:else}
<<<<<<< HEAD
=======
        <div class="nav-pages">
            {#each data.content as content, i}
                <a data-sveltekit-reload href= "/lessons/{$page.params.id}/{$page.params.module_number}:{data.moduleId}+{i}">
                    <div class="page-opt">
                        <div class="subchapter {$page.params.page <= i ? "active":""}">
                            
                            <div class="subchapter-number {parseInt($page.params.page) === i ? "active":""}">
                                <span>
                                    {i+1}
                                </span> 
                            </div>
                            <div class="subchapter-title">
                                {content.title}
                            </div>
                            
                        </div>
                    </div>
                </a>
            {/each}
        </div>
>>>>>>> main
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
                <input type="hidden" name="next-page" value={"/lessons/"+$page.params.id+"/"+$page.params.module_number+":"+data.moduleId+"+"+ data.content.length}>
                <input type="hidden" name="module-id" value={data.moduleId}>
                <button class="module-submit add-page" type="submit">nova página</button>
            </form>
        </div>
        <!-- <form action="?/deleteContent"></form> -->
    {/if}
</main>

<style>
    :root{
        background-color: rgb(247, 247, 247);
    }
    .top-close-bar{
        position: sticky;
        top: 89px;
        left: 0;
        width: 98%;
        border-bottom: 1px solid black;
        background-color: white;
        padding: 1%;
        font-size: 20pt;
        z-index: 19;
    }
    .close-lesson{
        transition: 0.5s;
    }
    .close-lesson:hover{
        filter: invert(24%) sepia(97%) saturate(6043%) hue-rotate(356deg) brightness(92%) contrast(124%);
    }
    h1{
        text-align: center;
    }

    .container{
        position: relative;
        left: 10%;
        width: 60%;
        font-size: 18pt;
        margin: 0rem auto;
        padding: 0 4rem;
        z-index: 1;

    }

    .nav-pages{
        position: fixed;
        top: 200px;
        left: 0;
        width: 20%;
    }
    .page-opt{
        max-width: 20rem;
        padding: 1.5rem 1rem;
        margin-bottom: 1.5rem;
        margin-left: 1rem;
        box-shadow: 5px 3px 5px 3px rgba(87, 87, 87, 0.219);
        background-color: white;
        color: black;
        text-decoration: none;

    }
    a{
        color: black;
        text-decoration: none;
    }
    .subchapter{
        display: flex;
        align-items: center;
    }
    .subchapter-number{
        display: flex;
        width: 40px;
        height: 40px;
        max-width: 40px;
        max-height: 40px;
        margin: 0 0.5rem;
        background-color: gray;
        color: white;
        border-radius: 20px;
        align-items: center;
        justify-content: center;
    }
    .subchapter-number.active{
        background-color: blue;
    }

    .module-content{
        padding: 1rem;
        margin: 2rem auto;
        border: 1px solid black;
        box-shadow: 5px 3px 5px 3px rgba(87, 87, 87, 0.219);
        background-color: white;
        border-radius: 30px;
    }
    .module-text{
        margin-left: 2rem;
    }

    .next-page{
        position: relative;
        padding: 1rem 1.5rem;
        width: fit-content;
        left:90%;
        margin: 1rem 0;
        background-color: blue;
        font-size: 12pt;
        font-family: inherit;
        outline: inherit;
        border-radius: 15%;
        color: white;
        cursor: pointer;
    }
    .next-page.back{
        position: absolute;
        background-color: black;
        top: 0;
        left: 8%;
    }

<<<<<<< HEAD
    .admin-button{
=======
    /* .admin-button{
>>>>>>> main
        position: relative;
        width: 60%;
        top: 1rem;
        left: 10%;
        width: 60%;
        margin: 0rem auto;
        text-align: center;
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
<<<<<<< HEAD
    }
=======
    } */
>>>>>>> main
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