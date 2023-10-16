<script>
    import {page} from "$app/stores";
    import * as converter from "$lib/stringHtmlConverter";

    export let data;
    let duration = stringify(data.dur_min, data.dur_max)+data.timeType;
    let mobileDisplay = "lessons";
    let editMode = false;

    // Duration into string
    function stringify(min, max){;
        let str;
        if(min === max){
            str = min;
        }
        else{
            str = min + "-" + max;
        }
        return str;
    }

    function toggleEdit(){
        editMode = !editMode;
    }

    function updateMobileDisplay(display){
        mobileDisplay = display;
    }
</script>

<main>
    <button class="edit-button toggle" on:click={toggleEdit}>{editMode ? "Voltar" : "Editar"}</button>
    
    <!-- mobile subsections -->
    <div class="mobile-nav">
        <button class="mobile-button {(mobileDisplay === "lessons")? "active":""}" on:click={() => updateMobileDisplay("lessons")}>Módulos</button>
        <button class="mobile-button {(mobileDisplay === "details")? "active":""}" on:click={() => updateMobileDisplay("details")}>Detalhes</button>
    </div>

    
    {#if !editMode}
    <div class="mobile-content">
        <h1>{data.name}</h1>
        <div class="course-details {(mobileDisplay === "details")? "open":""}">
            
            <!-- Mobile Image -->
            <div class="mobile-details-image">
                <img src={data.image} alt="mc12" class="course-image">
            </div>
            
            <div class="details-context">
                    <p><b>Descrição:</b> {@html data.description}</p>
                    <p><b>Duração:</b> {duration}</p>
                </div>
                <div class="details-image">
                <img src={data.image} alt="mc12" class="course-image">
            </div>
        </div>
        <div class="lessons {(mobileDisplay === "lessons")? "open":""}">
            {#if data.lessons.length === 0}
            <h2>Não existem módulos para este curso</h2>
            {/if}
            {#each data.lessons as lesson, i}
            <a href="/lessons/{$page.params.id}/{lesson.id}+0">
                <div class="lesson">
                    <div class="lesson-content">Módulo {i+1}: {lesson.title}</div>
                </div>
            </a>
            {/each}
        </div>
    </div>
    
    {:else}
    <div class="mobile-content">
        <form method="POST" action="?/updateCourse">
            <label class="input-label title" for="title">Titulo:</label>
            <input class="details-input title" type="text" name="title" value={data.name} autocomplete="off">
            <div class="course-details {(mobileDisplay === "details")? "open":""}">
                
                <!-- Mobile Image -->
                <div class="mobile-details-image">
                    <img src={data.image} alt="mc12" class="course-image">
                </div>
                
                <div class="details-context">
                    <input type="hidden" name="id" value={data.id}>
                    <!-- <input type="hidden" name="title" value={data.name}> -->
                    <label for="description">Descrição: </label>
                    <textarea class="details-input" type="text" name="description" value = {converter.htmlToString(data.description)}></textarea> <br><br>
                    <label for="duration-min">Duração: de</label>
                    <input class="details-input number" type="number" name="duration-min" value = {data.dur_min}>
                    <label for="duration-max">a</label>
                    <input class="details-input number" type="number" name="duration-max" value = {data.dur_max}>
                    <select name="time-type">
                        <option value="min">minutos</option>
                        <option value="h">horas</option>
                        <option value="d">dias</option>
                        
                    </select> <br> <br>        
                    <button type="submit" class="edit-button"> Guardar </button>
                </div>
                <div class="details-image">
                    <img src={data.image} alt="mc12" class="course-image">
                </div>
            </div>
        </form>
        <div class="lessons {(mobileDisplay === "lessons")? "open":""}">
            {#each data.lessons as lesson, i}
                <form method="POST" action="?/updateModule">
                    <div class="lesson">
                        <input type="hidden" name="module-id" value={lesson.id}>
                        <label for="module-title" class="lesson-content">Módulo {i+1}: </label>
                        <input class="module-input" type="text" name="module-title" value={lesson.title} autocomplete="off">
                        
                        <div class="module-edit-buttons">
                            <button class="edit-button" type="submit">ok</button>
                            <form method="POST" action="?/deleteModule">
                                <input type="hidden" name="module-id-delete" value={lesson.id}>
                                <button class="edit-button" style="background-color: red; margin-left:0.2rem;" type="submit">del</button>
                            </form>
                        </div>
                    </div>
                </form>
            {/each}
            <a data-sveltekit-reload href="/lessons/{data.id}/0+0">
                <div class="lesson">
                    <div class="lesson-content">Adicionar Módulo</div>
                </div>
            </a>
        </div>
    </div>    
    {/if}
</main>

<style>
    .mobile-nav{
        display: none;
    }
    .mobile-details-image{
        display: none;
    }
    .mobile-content{
        position: relative;
    }

    
    h1{
        margin-left: auto;
        margin-right: auto;
        width: 80%;
    }
    .course-details{
        display: grid;
        grid-template-columns: auto max(400px, 30%);
        margin: 1rem auto 3rem auto;
        width: 80%;
        text-align: start;
    }
    .details-context{
        margin-right: 2rem;
    }
    .input-label.title{
        font-size: inherit;
        font-family: inherit;
        margin-left: 10%;
        font-size: 20pt;
    }
    .details-input{
        font-size: inherit;
        font-family: inherit;
        width: 100%;
        height: 10rem;
        resize: none;
    }
    .details-input.title{
        width: auto;
        height: auto;
        font-size: 20pt;
        margin-top: 2rem;
    }
    .details-input.number{
        width: 50px;
        height: auto;
    }
    .details-image{
        position: relative;
        min-height: 20rem;
        overflow: hidden;
    }
    .course-image{
        max-width: 100%;
        max-height: 20rem;
        position: absolute;
        right: 0;
        top:50%;
        border: 1px solid black;
        transform: translateY(-50%);
    }
    h2{
        text-align: center;
        margin-top: 3rem;
    }
    .lesson{
        position: relative;
        width: 80%;
        margin:2rem auto 2rem auto;
        padding: 1rem 0rem 1rem 0rem;
        background-color: rgb(173, 173, 173);
        border-radius: 10px;
    }
    .lesson:hover{
        background-color: rgb(146, 146, 146);
    }
    .lesson-content{
        margin-left: min(5%, 2rem);
    }
    a{
        text-decoration: none;
        color: black;
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
    }

    .edit-button.toggle{
        margin:3rem 50% 0rem 50%;
    }
    .module-edit-buttons{
        display: flex;
        position: absolute;
        top: 50%;
        right: 2rem;
        transform: translateY(-50%);
    }
    .module-input{
        font:inherit;
        min-width: max-content;
        max-width: 60%;
    }

    @media (max-width: 900px){
        .mobile-nav{
            display: flex;
            margin-left: 1rem;
            margin-top: 1rem;
            /* background-color: aqua; */
        }
        .mobile-button{
            margin-bottom: -55px;
            margin-top: 0px;
            padding: 5px 10px 50px 10px;
            height: 90px;
            min-width: 6rem;
            border-radius: 30px;
            font-size: 11pt;
            position: relative;
            z-index: 1;

            /* no style button */

            font-family: inherit;
            font-size: inherit;
        }
        .mobile-button.active{
            background-color: aquamarine;
            margin-top: -5px;
            height: 95px;
            z-index: 4;
        }
        .mobile-button:nth-child(n+2){
            margin-left: -8px;
        }
        .mobile-content{
            position: relative;
            margin: 0 0.5rem 0 0.5rem;
            border-radius: 10px;
            z-index: 10;
            background-color: white;
            border: 1px solid black;
        }
        .course-details{
            display: block;
            margin-bottom: 2rem;
        }
        .lessons{
            display: none;
        }
        .lessons.open{
            display: block;
        }
        .course-details{
            display: none;
        }
        .course-details.open{
            display: block;
        }
        .course-image{
            position: relative;
            margin: 0;
            max-width: 200px;
            max-height: 200px;
            text-align: center;
        }
        .details-image{
            display: none;
        }
        .mobile-details-image{
            display: block;
            width: 200px;
            height: 200px;
            margin: auto;
            /* overflow: hidden; */
        }
    }
</style>