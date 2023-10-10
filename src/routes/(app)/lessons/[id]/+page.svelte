<script>
    export let data;
    let duration = stringify(data.dur_min, data.dur_max);
    let mobileDisplay = "lessons";
    let editMode = false;

    // Duration into string
    function stringify(min, max){
        let timeType = "min";
        if(min > 120){
            [min, max] = [(min/60), (max/60)];
            timeType = "h";
        }
        let str;
        if(min === max){
            str = min+timeType;
        }
        else{
            str = min + "-" + max+timeType;
        }
        return str;
    }

    function updateMobileDisplay(display){
        mobileDisplay = display;
    }
</script>

<main>
    {#if !editMode && !data.newCourse}
    <!-- mobile subsections -->
    <div class="mobile-nav">
        <button class="mobile-button {(mobileDisplay === "lessons")? "active":""}" on:click={() => updateMobileDisplay("lessons")}>Módulos</button>
        <button class="mobile-button {(mobileDisplay === "details")? "active":""}" on:click={() => updateMobileDisplay("details")}>Detalhes</button>
    </div>

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
            <a href="/in_construction">
                <div class="lesson">
                    <div class="lesson-content">Módulo {i+1}: {lesson}</div>
                </div>
            </a>
            {/each}
        </div>
    </div>
    
    {:else}
    
    <!-- mobile subsections -->
    <div class="mobile-nav">
        <button class="mobile-button {(mobileDisplay === "lessons")? "active":""}" on:click={() => updateMobileDisplay("lessons")}>Módulos</button>
        <button class="mobile-button {(mobileDisplay === "details")? "active":""}" on:click={() => updateMobileDisplay("details")}>Detalhes</button>
    </div>

    <div class="mobile-content">
        <form action="">
            <h1>{data.name}</h1>
            <button type="submit" class="add-course"> submit </button>
            <div class="course-details {(mobileDisplay === "details")? "open":""}">
                
                <!-- Mobile Image -->
                <div class="mobile-details-image">
                    <img src={data.image} alt="mc12" class="course-image">
                </div>
            
                <div class="details-context">
                    <label for="description">Descrição: </label>
                    <input class="details-input" type="text" name="description" value = {data.description}> <br><br>
                    <label for="duration-min">Duração: </label>
                    <input class="details-input number" type="number" name="duration-min" value = {data.dur_min}>
                    <label for="duration-max">-</label>
                    <input class="details-input number" type="number" name="duration-max" value = {data.dur_min}>
                    <select name="time-type">
                        <option value="min">minutos</option>
                        <option value="h">horas</option>
                        <option value="d">dias</option>
                        
                    </select>        
                </div>
                <div class="details-image">
                    <img src={data.image} alt="mc12" class="course-image">
                </div>
            </div>
        </form>
        <div class="lessons {(mobileDisplay === "lessons")? "open":""}">
            {#if data.lessons.length === 0}
            <h2>Não existem módulos para este curso</h2>
            {/if}
            {#each data.lessons as lesson, i}
            <a href="/in_construction">
                <div class="lesson">
                    <div class="lesson-content">Módulo {i+1}: {lesson}</div>
                </div>
            </a>
            {/each}
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
    .details-input{
        font-size: inherit;
    }
    .details-input.number{
        width: 50px;
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

    .add-course{
        position: absolute;
        top: 1rem;
        right: 3rem;
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