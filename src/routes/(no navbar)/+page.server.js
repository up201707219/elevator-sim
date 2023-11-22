import { invalid, redirect } from '@sveltejs/kit';
import { pool } from "$lib/db";
import { fail } from "@sveltejs/kit";
import { invalidate } from '$app/navigation';

export const ssr = false;

export function load({cookies}){
    const user = cookies.get('user');
    if(user){
        throw redirect(302, '/home');
    }
}

export const actions = {
    checkCredentials: async ({cookies, request}) => {
        const data = await request.formData();
        const val = {
            username: data.get('username'),
            password: data.get('password')
        };
        try{
            const query = 'SELECT * FROM Users ' +
            'WHERE username = $1;';
            const values = [val.username];
            
            const res = await pool.query(query, values);
            if(res.rows.length === 0){
                return {invalid: true};
            }
            
            if(val.password !== res.rows[0].pass){
                return {invalid: true};
            }

            const aux = {
                id: res.rows[0].id,
                username: res.rows[0].username,
                isAdmin: res.rows[0].isadmin
            }

            cookies.set('userId', aux.id, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60*60*24*30
            });
            
            cookies.set('user', aux.username, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60*60*24*30
            });

            cookies.set('userIsAdmin', aux.isAdmin, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60*60*24*30
            });
            //throw redirect(303, '/home');
        }
        catch(err){
            console.error(err);
            return fail(422, {
                error: err.message
            });           
        }
    },

    logoutUser:  async ({cookies, request}) => {
        cookies.set('userId', '', {
            path: '/',
            expires: new Date(0),
            });

            cookies.set('user', '', {
            path: '/',
            expires: new Date(0),
            });

            cookies.set('userIsAdmin', '', {
            path: '/',
            expires: new Date(0),
            })     
    }
}
