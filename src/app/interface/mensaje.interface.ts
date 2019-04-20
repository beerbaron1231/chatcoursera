export interface Mensaje {
    from: string;
    to: string;
    message: string;
    date?: number;
}
export interface User {
    uid: string;
    email: string;
    emailVerified: boolean;
 }