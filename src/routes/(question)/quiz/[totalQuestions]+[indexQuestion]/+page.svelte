<script>
    import {page} from "$app/stores";

    export let data;

    let displayedQuestion;

    $: displayedQuestion = data.quiz[$page.params.indexQuestion];

    function alertUser(event){
        event.preventDefault();
        event.returnValue = '';
    }

</script>


<svelte:window on:beforeunload={alertUser}/>
<main>
    <div class="question-content">
        <div class="question-header">
            <h1>Question Displayed: {displayedQuestion.context}</h1>
        </div>
        <ul>
            {#each displayedQuestion.answers as answer}
                <li>{answer}</li>   
            {/each}
        </ul>
        <div class="question-prev">
            {#if parseInt($page.params.indexQuestion) > 0}
                <a href="/quiz/{$page.params.totalQuestions}+{parseInt($page.params.indexQuestion)-1}"> prev </a>
            {/if}
        </div>
        <div class="question-next">
            {#if data.quiz.length > parseInt($page.params.indexQuestion)+1}
                <a href="/quiz/{$page.params.totalQuestions}+{parseInt($page.params.indexQuestion)+1}"> next </a>
            {/if}
        </div>
    </div>
    {#if data.quiz.length > 1}
    {#each data.quiz as _, i}
        <a href="/quiz/{$page.params.totalQuestions}+{i}">question {i+1}</a>
        <br>
    {/each}
    {/if}
</main>

<style>
    .question-header{
        text-align: center;
        color: blue;
    }
    .question-header h1{
        font-size: 20pt;
    }
    .question-content{
        margin: 4rem auto 1rem auto;
        width: 80%;
        min-height: 20rem;
        background-color: aliceblue;
        border-radius: 40px;
        text-align: center;
        position: relative;
    }
    .question-content ul{
        padding: 1rem;
        padding-left: 3rem;
        list-style-type: none;
    }
    .question-content ul li{
        /* padding: 1rem; */
        margin: 1rem;
    }
    .question-next{
        position: absolute;
        bottom: 50%;
        right: 0;
    }
    .question-prev{
        position: absolute;
        bottom: 50%;
        left: 0;
    }
</style>

    
