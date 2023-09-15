<script>
    import { goto } from "$app/navigation";
    import {page} from "$app/stores";

    export let data;

    let displayedQuestion;

    $: displayedQuestion = data.quiz[$page.params.indexQuestion];

    function selectQuestion(index){
        //indexDisplayed = index;
        let newUrl = "/quiz/"+data.quiz.length+"+"+index;
        let currentUrl = $page.url.pathname;
        if(newUrl === currentUrl){
            return;
        }
        goto(newUrl);
    }

    function alertUser(event){
        event.preventDefault();
        event.returnValue = '';
    }

</script>


<svelte:window on:beforeunload={alertUser}/>
<main>
    {#each data.quiz as question}
        <h1>{question.context}</h1>
        <br>
    {/each}
    <h2>Question Displayed: {displayedQuestion.context}</h2>
    <br>
    {#if data.quiz.length > 1}
    {#each data.quiz as _, i}
        <button on:click|preventDefault={() => selectQuestion(i)}>question {i+1}</button>
    {/each}
    {/if}
</main>

    
