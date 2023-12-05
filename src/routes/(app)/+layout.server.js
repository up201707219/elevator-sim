import { redirect } from '@sveltejs/kit';

export async function load({cookies}){
    const user = {
        id: cookies.get('userId'),
        username: cookies.get('user'),
        isAdmin: cookies.get('userIsAdmin')
    };
    if(!user.id){
        throw redirect(307, '/')
    }

    return {
        user: user
    };
    
}