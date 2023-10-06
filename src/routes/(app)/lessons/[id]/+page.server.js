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
        const query = 'SELECT * FROM' + 
            '(SELECT frm.Courses.*, frm.Modules.Title AS module FROM frm.Courses '+
            'LEFT JOIN frm.Modules '+
            'ON frm.Courses.ID = frm.Modules.CourseID) AS course '+
            'WHERE course.ID = ' + id;
        const res = await pool.query(query);
        let course = {
            id: res.rows[0].id,
            name: res.rows[0].title,
            description: res.rows[0].descript,
            dur_min: res.rows[0].durmin,
            dur_max: res.rows[0].durmax,
            lessons: [],
            image: res.rows[0].imageid
        }
        res.rows.forEach(element => {
            if(element.module !== null){
                course.lessons.push(element.module);
            }
        });

        return course;
    }catch (error){
        console.error(error);
    }
}

export function load({params}){
    if(parseInt(params.id) === 0){
        return addNew;
    }
    // let module = lessonModules.find((element) => element.id === parseInt(params.id));
    let module = getCourseByID(params.id);
    return module;
}