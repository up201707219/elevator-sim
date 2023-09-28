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
    <div class="formation-done-accordion">
     <button class="accordion-button" on:click={()=>toggleAccordion()}>Formações prévias</button>
    </div>
    <ul class="panel {accordionIsOpen? "open":""}" bind:this={accNode}>    
        {#each data.formations as formation}
        <li>Formação de {formation.name} (realizada no dia {formation.date})</li>
        {/each}
    </ul>
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
        padding-top: 0;
    }
    .panel{
        height: 0;
        margin: -0.5rem 0rem 0 0rem;
        padding-top: 0rem;
        overflow: hidden;
        background-color: bisque;
        transition: 0.2s;
    }
    .panel li{
        margin: 1rem;
    }
    .accordion-button {
        background-color:rgb(173, 173, 173);;
        width: 100%;
        text-align: start;
        margin: auto;
        padding: 0.8rem;
        border-radius: 12px;
        /* no style button */
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
        

    }
</style>