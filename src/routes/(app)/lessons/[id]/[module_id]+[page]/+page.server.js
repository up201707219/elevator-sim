import { pool } from "$lib/db";
import {v4 as uuidv4} from "uuid";
import { error, redirect } from "@sveltejs/kit";

const addNew = {
    courseId: 0,
    moduleId: 0,
    moduleTitle: "Título do módulo",
    content:[
        {
            id: 0,
            context: "Aqui fica o conteúdo do módulo da primeira página é possivel adicionar mais páginas",
            page_ind: 1
        }
    ]
}

async function insertDefaultModule(){
    try{
        const query = "INSERT INTO frm.Modules (ID, Title, CourseID)"+
        "VALUES ('" + addNew.moduleId + "', '" +addNew.moduleTitle + "', '" + addNew.courseId +"');"
        
        await pool.query(query);
    }
    catch (error){
        console.error(error);
    }
}

async function getContentByModuleID(id){
    try{
        const query = "SELECT frm.Module_Content.id, frm.Module_Content.content, frm.Module_Content.page_ind, frm.Modules.ID as moduleid, frm.Modules.title FROM frm.Modules "+
        "LEFT JOIN frm.Module_Content ON frm.Modules.ID = frm.Module_Content.ModuleID " +
        "WHERE frm.Modules.ID = '" + id + "' "+
        "ORDER BY frm.Module_Content.Page_ind ASC;";
        const res = await pool.query(query);
        let val = {
            moduleId: res.rows[0].moduleid,
            moduleTitle: res.rows[0].title,
            content: []
        }
        res.rows.forEach(element => {
            let content = {
                id: element.id,
                context: element.content,
                page_ind: element.page_ind
            };
            val.content.push(content);
        });
        return val;
    }catch (error){
        console.error(error);
    }
}

export async function load({params}){
    if(parseInt(params.module_id) === 0){
        addNew.courseId = params.id;
        addNew.moduleId = uuidv4();
        console.log(addNew.id);
        await insertDefaultModule();
        throw redirect(302, "/lessons/"+params.id+"/"+addNew.moduleId+"+"+"0");
    }
    let module = await getContentByModuleID(params.module_id);
    return module;
}