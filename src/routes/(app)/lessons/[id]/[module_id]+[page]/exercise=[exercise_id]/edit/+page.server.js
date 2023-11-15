import { pool } from "$lib/db";

async function insertImage(menuId, image){
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    try {
        const query = 'INSERT INTO Menu_Images (Menu_ID, IMAGE_NAME, IMAGE_TYPE, IMAGE_SIZE, IMAGE_DATA)' +
        'VALUES ($1, $2, $3, $4, $5) '+
        'ON CONFLICT (Menu_ID) DO UPDATE '+
        'SET IMAGE_NAME = $2, '+
        'IMAGE_TYPE = $3, ' +
        'IMAGE_SIZE = $4, ' +
        'IMAGE_DATA = $5;';

        const values = [menuId, image.name, image.type, image.size, buffer];

        await pool.query(query, values);
    } catch(err) {
        console.error(err);
    }
}

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

        //console.log(val.image);
        if(val.image.size !== 0){
            insertImage(val.id, val.image);
        }
        
        //console.log(buffer);

        try{
            let query;
            let values;

            if(val.id !== 0){
                query = 'UPDATE Question_Menu '+
                'SET descript = $1, '+
                'response = $2, '+
                'points = $3, '+
                'title = $4 '+
                'WHERE ID = $5';

                values = [val.description, val.response, (isNaN(val.points) ? null : val.points), val.title, val.id];
            }
            else{
                query = 'INSERT INTO Question_Menu (Title, Question_Id, Descript, Response, Parent_ID, Points)' +
                'Values($1, $2, $3, $4, $5, $6);';
                values = [val.title, '0', val.description, val.response, val.parent, (isNaN(val.points) ? null : val.points)];
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