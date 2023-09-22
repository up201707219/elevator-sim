import { lessonModules } from "./data";

export function load({params}){

    let module = lessonModules.find((element) => element.id === parseInt(params.id));
    return module;
}