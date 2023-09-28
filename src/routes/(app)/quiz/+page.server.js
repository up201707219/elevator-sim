import { formationsDone } from "./data";

export function load(){
    return{
        formations: formationsDone.map((formation)=>({
            name: formation.name,
            date: formation.date
        }))
    }
}