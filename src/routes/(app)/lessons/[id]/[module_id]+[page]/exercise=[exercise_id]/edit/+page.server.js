import { pool } from "$lib/db";

export const actions = {
    insertNewButton: async ({request}) => {
        const data = await request.formData();
        let val = {
            id: parseInt(data.get('id').valueOf()),
            parent: (data.get('parent-id').valueOf() === 'undefined' ? null:data.get('parent-id').valueOf()),
            title: data.get('title').valueOf(),
            description: data.get('description')?.valueOf(),
            response: data.get('response').valueOf(),
            image: data.get('image')?.valueOf(),
            points: parseInt(data.get('points')?.valueOf())
        };

        //console.log(val.image.type)
 
        const arrayBuffer = await val.image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        //console.log(buffer);

        try{
            let query;
            let values;

            if(val.id !== 0){
                query = 'UPDATE Question_Menu '+
                'SET descript = $1, '+
                'response = $2, '+
                'points = $3, '+
                'title = $4, '+
                'Image_Arr = $5, '+
                'Image_type = $6 '+
                'WHERE ID = $7';

                values = [val.description, val.response, (isNaN(val.points) ? null : val.points), val.title, buffer, val.image.type, val.id];
            }
            else{
                query = 'INSERT INTO Question_Menu (Title, Question_Id, Descript, Response, Parent_ID, Points, Image_Arr, image_type)' +
                'Values($1, $2, $3, $4, $5, $6, $7, $8);';
                values = [val.title, '0', val.description, val.response, val.parent, (isNaN(val.points) ? null : val.points), buffer, val.image.type];
            }
            //console.log(query);

            await pool.query(query, values);
        }
        catch(err){
            console.error(err);
        }  
    },

    deleteButton: async ({request}) => {
        const data = await request.formData();
        let val = {
            id: parseInt(data.get('id').valueOf()),
        };
        try{
            const query = 'DELETE FROM Question_Menu '+
                'WHERE ID = $1';

            const values = [val.id];

            await pool.query(query, values);
        }
        catch(err){
            console.error(err);
        }  

    }
}