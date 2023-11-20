<script>
    import {page} from "$app/stores";
    import * as converter from "$lib/stringHtmlConverter";
    import quizImg from "$lib/assets/img/quiz.png";
    import certificateImg from "$lib/assets/img/certificate.png";

    export let data;
    let duration = stringify(data.dur_min, data.dur_max)+data.timeType;
    let mobileDisplay = "lessons";
    let editMode = false;
    let aux = [{
        completed: 3,
        total: 3,
    },
    {
        completed: 1,
        total: 2,
    },
    {
        completed: 0,
        total: 1,
    },
    {
        completed: 0,
        total: 1,
    },
    ];

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
    
    <!-- mobile subsections -->
    <div class="mobile-nav">
        <button class="mobile-button {(mobileDisplay === "lessons")? "active":""}" on:click={() => updateMobileDisplay("lessons")}>Módulos</button>
        <button class="mobile-button {(mobileDisplay === "details")? "active":""}" on:click={() => updateMobileDisplay("details")}>Detalhes</button>
    </div>

    {#if data.user.isAdmin === "true"}
        <div class="admin-button">
            <button class="edit-button toggle" on:click={toggleEdit}>{editMode ? "Voltar" : "Editar"}</button>
        </div>
    {/if}
    
    {#if !editMode}
    <div class="mobile-content">
        <h1>{data.name}</h1>
        <div class="course-details {(mobileDisplay === "details")? "open":""}">
            
            <!-- Mobile Image -->
            <div class="mobile-details-image">
                <img src={data.image} alt="mc12" class="course-image">
            </div>
            

            <div class="details-context">
                <h2>Vista geral do curso</h2>
                <div class="details-content">
                    <p><b>Descrição:</b> {@html data.description}</p>
                    <p><b>Duração:</b> {duration}</p>
                </div>
                <p>Formador: Gonçalo Resende</p>
            </div>
            <div class="details-image">
                <img src={data.image} alt="mc12" class="course-image">
            </div>
        </div>
        <div class="lessons {(mobileDisplay === "lessons")? "open":""}">
            <h2>Módulos</h2>
            {#if data.lessons.length === 0}
            <h2 class="center">Não existem módulos para este curso</h2>
            {/if}
            {#each data.lessons as lesson, i}
            <a href={i <= 0 ? ('/lessons/'+ $page.params.id +'/'+ i + ':' + lesson.id +'+0') : parseFloat(aux[i-1].completed/aux[i-1].total)<1 ? '' : ('/lessons/'+ i + ':' + $page.params.id +'/' + lesson.id +'+0')}>
                <div class="lesson {aux[i].completed===0?"" : parseFloat(aux[i].completed/aux[i].total)<1?"orange":"green"} {i===0 ? "":parseFloat(aux[i-1].completed/aux[i-1].total)<1 ? "disabled":""}">
                    <div class="lesson-content">Módulo {i+1}: {lesson.title}</div>
                </div>
            </a>
            {/each}
        </div>
        <div class="lessons">
            <h2>Teste</h2>
            <div class="quiz-content">
                <a href="{$page.url.pathname}/exercise=0">
                    <img class="quiz-content-image" src={quizImg} alt="">
                    <span class="quiz-content-text">Sem nota atribuida</span>
                </a>
            </div>
        </div>
        <div class="lessons">
            <h2>Certificado</h2>
            <div class="quiz-content">
                <a href={$page.url}>
                    <img class="quiz-content-image" src={certificateImg} alt="">
                    <span class="quiz-content-text"></span>
                </a>
            </div>
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
                    <h2>Vista geral do curso</h2>
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
            <h2>Módulos</h2>
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
            <a data-sveltekit-reload href="/lessons/{data.id}/{data.lesson.length}:0+0">
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
        padding-bottom: 2rem;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
    }
    .details-context{
        margin-right: 2rem;
    }
    .details-content{
        margin-left: 2rem;
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
    .lessons{
        width: 80%;
        margin: auto;
        padding-bottom: 1rem;
        border-bottom: 1px solid black;
    }
    h2.center{
        text-align: center;
        margin-top: 3rem;
    }
    .lesson{
        position: relative;
        width: 100%;
        margin:2rem auto 2rem auto;
        padding: 1rem 0rem 1rem 0rem;
        background-color: rgb(156, 156, 156);
        border-radius: 10px;
    }
    .lesson.disabled{
        background-color: rgb(190, 190, 190);
        cursor: default;
    }
    .lesson.green{
        background-color: green;
    }
    .lesson.orange{
        background-color: orange;
    }
    .lesson:hover{
        background-color: rgb(146, 146, 146);
    }
    .lesson.disabled:hover{
        background-color: rgb(190, 190, 190);
    }
    .lesson.green:hover{
        background-color: rgb(0, 224, 0);
    }
    .lesson.orange:hover{
        background-color: rgb(253, 187, 64);
    }
    .lesson-content{
        margin-left: min(5%, 2rem);
    }
    a{
        text-decoration: none;
        color: black;
    }
    .quiz-content{
        width: fit-content;
        margin-left: 2rem;
        position: relative;
    }
    .quiz-content-image{
        max-width: 60px;
        max-height: 60px;
    }
    .quiz-content-text{
        position: relative;
        top: -20px;
        margin-left: 1rem;
    }
    .admin-button{
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
    }
    .edit-button.toggle{
        margin:1rem auto 0rem auto;
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