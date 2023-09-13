<script>
//     import quiz1 from "$lib/assets/img/quiz1.jpg"
//     import quiz2 from "$lib/assets/img/quiz2.jpg"
//     import quiz3 from "$lib/assets/img/quiz3.jpg"

//   let quizes = [
//     {
//         type: "Prova Teste",
//         image: quiz1
//     },
//     {
//         type: "Prova Real",
//         image: quiz2
//     },
//     {
//         type: "Pergunta Aleatória",
//         image: quiz3
//     }
//   ]

    export let data;
</script>

<div class="container">
    {#each data.quizes as quiz}
        <div class="option-container">
            <p>{quiz.type}</p>
            <a href="/quiz/{quiz.totalQuestions}" class="quiz-options">
                <img class="quiz-image" src={quiz.image} alt="">
            </a>
        </div>      
    {/each}
</div>

<style>
    .container{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: 1fr;
        padding: 1rem;
        margin-top: 8rem;
    }

    .option-container{
        margin: auto;
        margin-top: 3rem;
        z-index: 2;
        width: 100%;
        text-align: center;
        font-size: 18pt;
        overflow: hidden;
        cursor: pointer;
        transition: 0.5s;
    }
    .option-container:hover{
        transform: scale(1.08);
    }

    .quiz-options{
        display: flex;
        flex-direction: column;
        margin: auto;
        padding: 0rem;
        width: 90%;
        height: 20rem;
        background-color: white;
        border-radius: 10px;
        box-shadow: 3px 3px 5px 3px rgba(87, 87, 87, 0.123);
        align-items: center;
        justify-content: center;
        overflow: hidden;
        z-index: 2;
        transition: 0.5s;
    }
    .quiz-image{
        min-width: 100%;
        width: auto;
        height: 100%;
        z-index: 1;
    }

    @media (max-width: 1100px){
        .container{
            display: block;
            /* grid-template-columns: repeat(1, 1fr);
            grid-auto-rows: 1fr; */
        }
        .option-container{
            width: 400px;
            margin-bottom: 2rem;
        }
    }
</style>