<script>
    import { goto } from "$app/navigation";
    import {page} from "$app/stores";

    export let data;

    let displayedQuestion;

    $: displayedQuestion = data.quiz[$page.params.indexQuestion];

    function selectQuestion(index){
        //indexDisplayed = index;
        goto("/quiz/"+data.quiz.length+"+"+index);
    }

    function hook(){
        alert("You cant leave");
    }

</script>


<svelte:window on:beforeunload={hook}/>
<main>
    {#each data.quiz as question}
        <h1>{question.context}</h1>
        <br>
    {/each}
    <h2>Question Displayed: {displayedQuestion.context}</h2>
    <br>
    {#if data.quiz.length > 1}
    {#each data.quiz as _, i}
        <button on:click={() => selectQuestion(i)}>question {i+1}</button>
    {/each}
    {/if}
</main>

    
