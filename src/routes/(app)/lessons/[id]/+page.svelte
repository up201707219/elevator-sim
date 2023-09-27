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
        <button class="mobile-button {(mobileDisplay === "details")? "active":""}" on:click={() => updateMobileDisplay("details")}>Detalhes</button>
        <button class="mobile-button {(mobileDisplay === "lessons")? "active":""}" on:click={() => updateMobileDisplay("lessons")}>Módulos</button>
    </div>
    <div class="mobile-content">
        <div class="course-details {(mobileDisplay === "details")? "open":""}">
            <h1>{data.name}</h1>
            <p><b>Descrição:</b> {@html data.description}</p>
            <p><b>Duração:</b> {duration}</p>
        </div>
        <div class="lessons {(mobileDisplay === "lessons")? "open":""}">
            {#each data.lessons as lesson, i}
            <a href="/in_construction">
                <div class="lesson">
                    <span class="lesson-content">Módulo {i+1}: {lesson}</span>
                </div>
            </a>
            {/each}
        </div>
    </div>
    {#if data.lessons.length === 0}
        <h2>Não existem lições para este módulo</h2>
    {/if}
</main>

<style>
    .mobile-nav{
        display: none;
    }
    .course-details{
        margin-left: auto;
        margin-right: auto;
        width: 80%;
        text-align: start;
        margin-top: 1rem;
        margin-bottom: 4rem;
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
        margin-left: 2rem;
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
            margin-bottom: -20px;
            padding: 5px 10px 20px 10px;
            border-radius: 20px;
            font-size: 11pt;
            position: relative;
            z-index: 1;
        }
        .mobile-button.active{
            background-color: aquamarine;
            z-index: 4;
        }
        .mobile-button:nth-child(n+2){
            margin-left: -10px;
        }
        .mobile-content{
            position: relative;
            margin: 0 0.5rem 0 0.5rem;
            border-radius: 10px;
            z-index: 20;
            background-color: white;
            border: 1px solid black;
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
    }
</style>