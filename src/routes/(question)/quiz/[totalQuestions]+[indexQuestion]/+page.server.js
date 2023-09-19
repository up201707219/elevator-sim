import { questions } from "./data";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomQuestions(numberOfQuestions){
    let questionsCopy = questions.map((x) => x);

    let quiz = [];

    for(let i = 0; i < numberOfQuestions && i < questions.length; i++){
        let index = getRandomInt(questionsCopy.length);
        quiz.push(questionsCopy[index]);
        questionsCopy.splice(index, 1);
    }
    return quiz;
}

export function load({params}){
    // let quests = getRandomQuestions(params.totalQuestions);
    let quests = questions;

    return {
        quiz: quests.map((question) => ({
            context: question.context,
            answers: question.answers
        })),
        totalQuestions: params.totalQuestions
    };
}