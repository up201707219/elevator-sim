import { lessonModules } from "./data";
import { pool } from "$lib/db";


async function getCourseByID(id){
    try{
        const query = "SELECT * FROM " + 
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
            lessons: [],
            // image: res.rows[0].imageid
            image: lessonModules[0].image,
            timeType: res.rows[0].timetype
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

export async function load({params}){
    //let module = lessonModules.find((element) => element.id === parseInt(params.id));
    let module = await getCourseByID(params.id);
    return module;
}