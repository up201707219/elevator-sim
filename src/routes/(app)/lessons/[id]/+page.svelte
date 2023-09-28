<script>
    export let data;
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
    let duration = stringify(data.dur_min, data.dur_max);
    let mobileDisplay = "lessons";

    function updateMobileDisplay(display){
        mobileDisplay = display;
    }
</script>

<main>
    <div class="mobile-nav">
        <button class="mobile-button {(mobileDisplay === "lessons")? "active":""}" on:click={() => updateMobileDisplay("lessons")}>Módulos</button>
        <button class="mobile-button {(mobileDisplay === "details")? "active":""}" on:click={() => updateMobileDisplay("details")}>Detalhes</button>
    </div>
    <div class="mobile-content">
        <h1>{data.name}</h1>
        <div class="course-details {(mobileDisplay === "details")? "open":""}">
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
</main>

<style>
    .mobile-nav{
        display: none;
    }
    .mobile-details-image{
        display: none;
    }
    h1{
        margin-left: auto;
        margin-right: auto;
        width: 80%;
    }
    .course-details{
        display: grid;
        grid-template-columns: 70% auto;
        margin: 1rem auto 3rem auto;
        width: 80%;
        text-align: start;
    }
    .details-context{
        margin-right: 1rem;
    }
    .course-image{
        margin-left: 1rem;
        max-width: 400px;
        max-height: 20rem;
        position: relative;
    }
    h2{
        text-align: center;
        margin-top: 3rem;
    }
    .lesson{
        width: 80%;
        margin:2rem auto 2rem auto;
        padding: 1rem;
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
            margin: 0;
            max-width: 200px;
            max-height: 200px;
            
        }
        .details-image{
            display: none;
        }
        .mobile-details-image{
            display: block;
            width: 200px;
            height: 200px;
            margin: auto;
            margin-top: 2rem;
            /* overflow: hidden; */
        }
    }
</style>