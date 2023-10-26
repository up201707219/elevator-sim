<script>
    export let data;
    
    let screenWidth;

    function stringifyDate(date){
        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    }
</script>

<svelte:window bind:innerWidth={screenWidth}/>

<h1>Formações</h1>
<div class="container">
    <h2>- Formações prévias</h2>
    <ul class="panel">    
        {#each data.formations as formation}
        <a href="/in_construction">
            <li>Formação de {formation.name} (realizada no dia {stringifyDate(formation.date)})</li>           
        </a>
        {/each}
    </ul>
    {#if data.formations.length <= 0}
    <h1>Não existem formações realizadas</h1>
    {/if}   
    {#if screenWidth !== undefined}
        <a href="/in_construction" class="formation-option">
            <div class="option">{ (screenWidth > 900)? "+ Nova formação" : "+"}</div>
        </a>
    {/if}
</div>

<style>
    h1{
        margin-top: 3rem;
        text-align: center;
        margin-bottom: 1rem;
    }
    h2{
        padding-left: 1rem;
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
        margin-top: 1rem;
        position: relative;
        background-color: aliceblue;
        padding: 1rem;
    }

    .panel{
        padding: 0;
        overflow: hidden;
        transition: 0.2s;
        z-index: 1;
    }
    .panel li{
        padding: 1.5rem;
    }
    .panel li:hover{
        background-color: rgb(252, 252, 252);
    }
    .formation-option {
        background-color:rgb(48, 209, 43);
        color: white;
        padding: 0.5rem;

        border-radius: 12px;
        position: absolute;
        top: 2rem;
        right: 2rem;
        z-index: 3;
    }
    
    @media (max-width: 900px){
        .container{
            padding: 0;
            padding-bottom: 0.5rem;
            border-radius: 20px;
        }
        .panel li{
            border-bottom: 1px solid black;
        }
        .formation-option{
            top: 1rem;
            background-color: transparent;
            border: 1px solid black;
            padding: 0rem 0.7rem;
            border-radius: 50%;
        }
        .option{
            font-size: 18pt;
            color: green;   
        }
    }
</style>