import { questions } from "../data";

export function load({params}){
    let question = questions[params.question];
    return question;
}