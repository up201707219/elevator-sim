<script>
    import example1 from "$lib/assets/img/example1.jpg"
    import example2 from "$lib/assets/img/example2.jpg"
    import example3 from "$lib/assets/img/example3.jpg"

    var lessonModules = [
        {
            name:"Cabina",
            image: example1,
            lessonsDone: 50,
            lessonsTotal: 100
        },
        {
            name:"Poço",
            image: example3,
            lessonsDone: 0,
            lessonsTotal: 15
        },
        {
            name:"Caixa de Máquinas",
            image: example2,
            lessonsDone: 20,
            lessonsTotal: 25
        },
        {
            name:"Lição 4",
            image: example2,
            lessonsDone: 2,
            lessonsTotal: 30
        },
        {
            name:"Lição 5",
            image: example2,
            lessonsDone: 28,
            lessonsTotal: 28
        }
    ];
</script>

<div class="container">
    <h1> Lições </h1>
    <div class="container-grid">
        {#each lessonModules as module}
            <div class="lessons">
                <img src={module.image} alt="Not found" class="lesson-image">
                <span style="margin-bottom: 2rem;">
                    {module.name}
                </span>
                <div class="completion">
                    <span>
                        {module.lessonsDone}/{module.lessonsTotal}
                    </span>
                    <progress value={module.lessonsDone} max={module.lessonsTotal} class="completion-bar"></progress>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .container{
        width: 80%;
        margin: 2rem;
        margin-left: 10%;
        margin-right: 10%;
        margin-top: 8rem;
        text-align: center;
    }

    .container-grid{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: 1fr;
        padding: 1rem;
        /* background-color: aliceblue; */
    }
    .lessons{
        margin: auto;
        margin-bottom: 2rem;
        margin-top: 2rem;
        width: 82%;
        max-height: 26rem;
        overflow: hidden;
        background-color: white;
        border-radius: 10px;
        box-shadow: 3px 3px 5px 3px rgba(87, 87, 87, 0.123);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: stretch;
        cursor: pointer;
        z-index: 2;
        transition: 0.5s;
    }
    .lessons:hover{
        transform: scale(1.08);
    }
    .lesson-image{
        min-width: 100%;
        width: auto;
        height: 12rem;
        text-align: center;
        margin-bottom: 3rem;
    }
    .completion{
        width: 100%;
        text-align: center;
        margin-bottom: 1.5rem;
        margin-top: auto;
        display: flex;
        flex-direction: column;
    }
    progress.completion-bar{
        width: 80%;
        height: 1rem;
        margin-left: auto;
        margin-right: auto;
        bottom: 10%;
        border-radius: 10px;
        background-color: gray;
        color: greenyellow;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    progress.completion-bar::-moz-progress-bar { 
        border-radius: 10px;
        background: greenyellow;
    }
    progress.completion-bar::-webkit-progress-value{ 
        border-radius: 10px;
        background: greenyellow;
    }
    progress.completion-bar::-webkit-progress-bar{ 
        border-radius: 10px;
    }

    @media (max-width: 1100px) {
        .container-grid{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 1fr;
            padding: 1rem;
        }
    }
</style>