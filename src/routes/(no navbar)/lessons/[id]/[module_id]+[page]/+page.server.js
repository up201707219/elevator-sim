import { pool } from "$lib/db";


async function getModuleByID(id){
    try{
        const query = "SELECT frm.Module_Content.*, frm.Modules.title FROM frm.Modules, frm.Module_Content "+
        "WHERE frm.Modules.ID = frm.Module_Content.ModuleID AND frm.Modules.ID = '" + 1 + "' "+
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
    let module = await getModuleByID(params.module_id);
    return module;
}