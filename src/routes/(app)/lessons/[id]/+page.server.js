import { lessonModules } from "./data";

export function load({params}){

    let module = lessonModules.find((element) => element.id === parseInt(params.id));
    // console.log(lessonModules[0]);
    // console.log(module);
    return module;
}