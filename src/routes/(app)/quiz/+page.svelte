<script>
    import quiz1 from "$lib/assets/img/quiz1.jpg"
    import quiz2 from "$lib/assets/img/quiz2.jpg"
    import quiz3 from "$lib/assets/img/quiz3.jpg"

    const quizes = [
        {
            type: "Prova Teste",
            totalQuestions: 10,
            image: quiz1
        },
        {
            type: "Prova Real",
            totalQuestions: 5,
            image: quiz2
        },
        {
            type: "Pergunta Aleatória",
            totalQuestions: 1,
            image: quiz3
        }
    ];

    export let data;

    let accordionIsOpen = false;
    let accNode;
   

    function toggleAccordion(){
        accordionIsOpen = !accordionIsOpen;
        if(accordionIsOpen){
            accNode.style.height = accNode.scrollHeight + "px"; 
        }
        else{
            accNode.style.height = 0 + "px";
        }
    }
</script>

<div class="container">
    <h1>Formações</h1>
    <div class="formations-done">
        <div class="formation-option">
            <button on:click={()=>toggleAccordion()}>Formações prévias</button>
        </div>
        <ul class="panel {accordionIsOpen? "open":""}" bind:this={accNode}>    
            {#each data.formations as formation}
            <li>Formação de {formation.name} (realizada no dia {formation.date})</li>
            {/each}
        </ul>
    </div>
    <div class="formation-option">
        <a href="/in_construction">Fazer formação</a>
    </div>
</div>

<style>
    h1{
        text-align: center;
    }
    .container{
        width: 80%;
        margin: auto;
        margin-top: 2rem;
        background-color: aliceblue;
        padding: 1rem;
    }
    .formations-done{
        margin-bottom: 5rem;
    }
    .panel{
        height: 0;
        margin-top: -0.5rem;
        overflow: hidden;
        background-color: bisque;
        transition: 0.2s;
        z-index: 1;
    }
    .panel li{
        margin: 1rem;
    }
    .formation-option {
        background-color:rgb(173, 173, 173);;
        width: 98%;
        text-align: start;
        margin: auto;
        padding: 0.7rem 1% 0.7rem 1%;
        border-radius: 12px;
        position: relative;
        z-index: 3;
        /* margin-bottom: 2rem; */
    }
    .formation-option button{
        /* no style button */
        background-color: transparent;
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
    }
    .formation-option a{
        text-decoration: none;
        color: inherit;
    }
</style>