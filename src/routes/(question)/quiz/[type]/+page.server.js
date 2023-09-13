import { redirect } from "@sveltejs/kit";
import { questions } from "./data";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function load(param){
    if(param = "Pergunta Aleatória"){
        let index = getRandomInt(questions.length);
        // throw redirect(308, "/quiz/"+{param}+"/"+{index});
        return {
            type : param
        };
    }

}