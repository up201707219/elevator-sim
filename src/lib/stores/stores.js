import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const user_login = writable({
    token: "",
    user_active: false,
    isAdmin: false
});

