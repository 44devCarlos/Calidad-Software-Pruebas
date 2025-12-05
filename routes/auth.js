import {Router} from 'express';
import {ControladorAuth} from '../controllers/authController.js';

export const crearAuthRouter = ({ControladorAuth}) => {
    const router = Router();

    const authControlador = new ControladorAuth({ControladorAuth});

    router.post('/login', authControlador);
}