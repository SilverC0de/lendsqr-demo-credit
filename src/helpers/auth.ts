import bcryptjs from 'bcryptjs';


export async function hashPassword(password: string) {
    return await bcryptjs.hash(password, 12);
}

export async function checkPassword(entered_password: string, user_password: string) {
    return await bcryptjs.compare(entered_password, user_password);
}