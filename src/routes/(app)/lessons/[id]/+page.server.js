import { lessonModules } from "./data";
import { pool } from "$lib/db";
import {v4 as uuidv4} from "uuid";

//const reload;

let addNew = {
    id: 0,
    name:"Título do curso",
    description: "Uma descrição sobre o curso",
    dur_min: 1,
    dur_max: 1,
    timeType: "min",
    lessons: [],
    image: null,
    newCourse: true
};

async function getCourseByID(id){
    try{
        const query = 'SELECT * FROM' + 
            "(SELECT frm.Courses.*, frm.Modules.Title AS module, frm.Modules.ID AS module_id FROM frm.Courses "+
            "LEFT JOIN frm.Modules "+
            "ON frm.Courses.ID = frm.Modules.CourseID) AS course "+
            "WHERE course.ID = '" + id + "' "+
            "ORDER BY course.module_id;";
        const res = await pool.query(query);
        let course = {
            id: res.rows[0].id,
            name: res.rows[0].title,
            description: res.rows[0].descript,
            dur_min: res.rows[0].durmin,
            dur_max: res.rows[0].durmax,
            timeType: res.rows[0].timetype,
            lessons: [],
            //image: res.rows[0].imageid,
            image: lessonModules[0].image,
            newCourse: false
        }
        res.rows.forEach(element => {
            if(element.module !== null){
                course.lessons.push(element.module);
            }
        });

        return course;
    }
    catch (error){
        console.error(error);
    }
}

async function insertDefualtCourse(){
    try{

        const query = "INSERT INTO frm.Courses (ID, Title, Descript, DurMin, DurMax) "+
        "VALUES ('" + addNew.id + "', 'Título do curso', 'Uma descrição sobre o curso', 1, 1);"
        
        await pool.query(query);
    }
    catch (error){
        console.error(error);
    }
}

export async function load({params}){
    addNew.id = uuidv4();
    console.log(addNew.id);
    if(parseInt(params.id) === 0){
        await insertDefualtCourse();
        return addNew;
    }
    //let module = lessonModules.find((element) => element.id === parseInt(params.id));
    let module = await getCourseByID(params.id);
    return module;
}