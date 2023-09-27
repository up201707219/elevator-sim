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
        {#if mobileDisplay === "lessons"}
            <button on:click={() => updateMobileDisplay("details")}>Detalhes</button>
        {:else}
            <button on:click={() => updateMobileDisplay("lessons")}>Módulos</button>
        {/if}
    </div>
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
        {#if data.lessons.length === 0}
        <h2>Não existem lições para este módulo</h2>
    {/if}
</main>

<style>
    .mobile-nav{
        display: none;
        width: 80%;
        margin: auto;
        margin-top: 2rem;
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
        margin:2rem auto auto auto;
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