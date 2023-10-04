import { lessonModules } from "./data";
import { pool } from "$lib/db";

let addNew = {
    id: 0,
    name:"Título do curso",
    description: "Uma descrição sobre o curso",
    dur_min: 0,
    dur_max: 1,
    lessons: [],
    image: null
};
async function getCourseByID(id){
    try{
        const res = await pool.query('select * from frm.Courses '+
        'where frm.Courses.ID = '+id
        );
        res.rows.forEach((element) => {
            console.log(element);
        });
    }catch (error){
        console.error(error);
    }
}

export function load({params}){
    if(parseInt(params.id) === 0){
        return addNew;
    }
    let module = lessonModules.find((element) => element.id === parseInt(params.id));
    // let module = getCourseByID(params.id);
    return module;
}