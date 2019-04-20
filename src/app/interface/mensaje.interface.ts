export interface Mensaje {
    from: string;
    to: string;
    mensaje: string;
    fecha?: number;
}
export interface User {
    uid: string;
    email: string;
    emailVerified: boolean;
 }