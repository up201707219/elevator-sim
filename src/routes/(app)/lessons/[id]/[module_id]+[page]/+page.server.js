import { pool } from "$lib/db";
import {v4 as uuidv4} from "uuid";
import { error, redirect } from "@sveltejs/kit";
import * as converter from "$lib/stringHtmlConverter";

let addNew = {
    moduleId: 0,
    courseId: 0,
    moduleTitle: "Título do módulo",
    content:[
        {
            id: 0,
            context: "Aqui fica o conteúdo do módulo da 1ª página é possivel adicionar mais páginas",
            page_ind: 1
        }
    ]
}

async function insertDefaultModule(){
    try{
        const query = "INSERT INTO frm.Modules (ID, Title, CourseID)"+
        "VALUES ('" + addNew.moduleId + "', '" +addNew.moduleTitle + "', '" + addNew.courseId +"');";
        
        await pool.query(query);
    }
    catch (error){
        console.error(error);
    }
}

async function insertDefaultContent(){
    
        try{
            const query = "INSERT INTO frm.Module_Content (ID, Content, ModuleID)"+
            "VALUES ('" + addNew.content[0].id + "', '" +addNew.content[0].context + "', '" + addNew.moduleId +"');";
            
            await pool.query(query);
        }
        catch (error){
            console.error(error);
        }
}

async function getCourseTitle(id){
    try{
        const query = "SELECT frm.Courses.title FROM frm.Courses "+
        "WHERE frm.Courses.ID = '" + id + "' ;";
        const res = await pool.query(query);
        let title = res.rows[0].title;
        return title;
    }catch (error){
        console.error(error);
    }
}

async function getContentByModuleID(id){
    try{
        const query = "SELECT frm.Module_Content.id, frm.Module_Content.content, frm.Module_Content.page_ind, frm.Modules.ID as moduleid, frm.Modules.title FROM frm.Modules "+
        "LEFT JOIN frm.Module_Content ON frm.Modules.ID = frm.Module_Content.ModuleID  AND frm.Module_Content.isDeleted IS NOT TRUE " +
        "WHERE frm.Modules.ID = '" + id + "' "+
        "ORDER BY frm.Module_Content.Page_ind ASC;";
        const res = await pool.query(query);

        let val = {
            courseTitle: "",
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
        addNew.content[0].id = uuidv4();
        await insertDefaultModule();
        await insertDefaultContent();
        throw redirect(302, "/lessons/"+params.id+"/"+addNew.moduleId+"+"+"0");
    }
    let module = await getContentByModuleID(params.module_id);
    module.courseTitle = await getCourseTitle(params.id);
    return module;
}

export const actions = {
    updateContent: async ({request}) => {
        const data = await request.formData();
        let val = {
            moduleId: data.get('module-id'),
            id: data.get('content-id'),
            content: data.get('module-content')
        };
        
        val.content = converter.stringToHtml(val.content);

        if(val.id === ""){
            try{
                let query = "INSERT INTO frm.Module_Content (ID, Content, ModuleID) "+
            "Values( '" + uuidv4() + "', '" + val.content + "', '" + val.moduleId + "');" 

            await pool.query(query);
            }
            catch(err){
                console.error(err);
            }
        }
        else{
            try{
                let query = "UPDATE frm.Module_content "+
                "SET content = '" + val.content + "' " +
                "WHERE ID = '" + val.id + "';";
    
                await pool.query(query);
            }
            catch(err){
                console.error(err);
            }        
        }
    },
    insertContent: async ({request}) => {
        const data = await request.formData();
        const val = {
            id: uuidv4(),
            moduleId: data.get('module-id'),
            content: "Esta é a nova página predefinida"
        };
        const nextPage = data.get('next-page');
        try{
            let query = "INSERT INTO frm.Module_Content (ID, Content, ModuleID) "+
            "Values( '" + val.id + "', '" + val.content + "', '" + val.moduleId + "');" 

            await pool.query(query);
        }
        catch(err){
            console.error(err);
        }
        throw redirect(302, nextPage);   
    },

}