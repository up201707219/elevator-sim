<script>
    
    import {page} from "$app/stores";

    export let data;

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getRandomQuestions(numberOfQuestions){
        let questionsCopy = data.quiz.map((x) => x);

        let quiz = [];

        for(let i = 0; i < numberOfQuestions && i < data.quiz.length; i++){
            let index = getRandomInt(questionsCopy.length);
            quiz.push(questionsCopy[index]);
            questionsCopy.splice(index, 1);
        }
        return quiz;
    }
    let quests = getRandomQuestions($page.params.totalQuestions);

    console.log(quests);

</script>

{#each quests as question}
    <h1>{question.context}</h1>
    <br>
{/each}