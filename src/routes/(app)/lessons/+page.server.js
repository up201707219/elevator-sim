import { lessonModules } from "./data";
import { pool } from "$lib/db";

async function getCourses(){
    try{
        const query = 'SELECT frm.Courses.ID, frm.Courses.Title, lessonCount.Total FROM frm.Courses, ' + 
        '(SELECT COUNT(frm.Modules.Title) AS Total, frm.Courses.ID FROM frm.Courses ' +
        'LEFT JOIN frm.Modules ' +
        'ON frm.Modules.courseID = frm.Courses.ID ' +
        'GROUP BY Courses.ID) AS LessonCount ' +
        'WHERE lessonCount.ID = frm.Courses.ID ';
        
        const res = await pool.query(query);
        let courses = [];
        res.rows.forEach(element => {
            
            courses.push({
                id: element.id,
                name: element.title,
                image: null,
                lessonsDone: 0,
                lessonsTotal: element.total
            });
        });
        console.log(courses);
        return courses;
    }catch (error){
        console.error(error);
    }
}


export function load({}){
    // let module = lessonModules.find((element) => element.id === parseInt(params.id));
    let modules = getCourses();
    return {
        lessonModules: lessonModules.map((module)=>({
            id: module.id,
            name: module.name,
            image: module.image,
            lessonsDone: module.lessonsDone,
            lessonsTotal: module.lessonsTotal
        }))
    };
}