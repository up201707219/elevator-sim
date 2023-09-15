<script>
    import { goto } from "$app/navigation";
    import {page} from "$app/stores";

    export let data;

    let displayedQuestion = data.quiz[data.indexDisplay];

    function selectQuestion(index){
        //indexDisplayed = index;
        goto("/quiz/"+data.quiz.length+"+"+index);
    }

    console.log(data.quiz);

</script>

<main>
    {#each data.quiz as question}
        <h1>{question.context}</h1>
        <br>
    {/each}
    <h2>Question Displayed: {displayedQuestion.context}</h2>
    <br>
    {#if data.quiz.length > 1}
        <form on:submit|preventDefault={() => selectQuestion(2)}>
            <button>question 2</button>
        </form>
    {/if}
</main>

    
