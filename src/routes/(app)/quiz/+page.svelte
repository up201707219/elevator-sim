<script>
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
            <a href="/in_construction">
                <li>Formação de {formation.name} (realizada no dia {formation.date})</li>
                
            </a>
            {/each}
        </ul>
    </div>
    <a href="/in_construction">
        <div class="formation-option">
            <span class="option">Fazer formação</span>
        </div>
    </a>
</div>

<style>
    h1{
        text-align: center;
        margin-bottom: 3rem;
    }
    a{
        text-decoration: none;
        color: black;
    }
    ul{
        list-style: none;
    }
    .container{
        width: 80%;
        margin: auto;
        margin-top: 2rem;
        background-color: aliceblue;
        padding: 1rem;
    }
    .formations-done{
        margin-bottom: 3rem;
    }
    .panel{
        height: 0;
        margin-top: -0.5rem;
        padding-top: 0rem;
        padding-left: 0;
        overflow: hidden;
        /* background-color: aquamarine; */
        transition: 0.2s;
        z-index: 1;
    }
    .panel.open{
        padding-top: 0.5rem;
    }
    .panel li{
        /* margin: 2rem; */
        padding: 1.5rem;
    }
    .panel li:hover{
        /* background-color: rgb(157, 248, 218); */
        background-color: rgb(252, 252, 252);
    }
    .formation-option {
        background-color:rgb(173, 173, 173);;
        width: 100%;
        height: 3rem;
        text-align: start;
        margin: auto;

        border-radius: 12px;
        position: relative;
        z-index: 3;
    }
    .formation-option button{
        cursor: pointer;
        /* no style button */
        width: 100%;
        height: 100%;
        padding-left: 1rem;
        text-align: start;
        background-color: transparent;
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
    }
    .option{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 1rem
    }
</style>