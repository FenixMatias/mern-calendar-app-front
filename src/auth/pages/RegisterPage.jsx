import { useEffect } from 'react';
import { Link, Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore, useForm } from '../../hooks';

const registerFormFields = {
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerPassword2: ''
}

export const RegisterPage = () => {

    const { startRegister, errorMessage } = useAuthStore();
    const { registerName, registerEmail, registerPassword, registerPassword2, onInputChange } = useForm(registerFormFields);

    const registerSubmit = (event) => {

        event.preventDefault();

        startRegister({name: registerName, email: registerEmail, password: registerPassword});
        
        if(registerPassword !== registerPassword2){

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no son identicas'
            });
        }
    }

    useEffect(() => {

        if(errorMessage !== undefined){

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage
            });
        }
    }, [errorMessage]);

    return (
        <div className="col-md-12 login-form-2">
            <h3>Registro</h3>
            <form onSubmit={registerSubmit}>
                <div className="form-group mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
                        name="registerName"
                        value={registerName}
                        onChange={onInputChange}
                    />
                </div>
                <div className="form-group mb-2">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Correo"
                        name="registerEmail"
                        value={registerEmail}
                        onChange={onInputChange}
                    />
                </div>
                <div className="form-group mb-2">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        name="registerPassword"
                        value={registerPassword}
                        onChange={onInputChange} 
                    />
                </div>

                <div className="form-group mb-4">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Repita la contraseña"
                        name="registerPassword2"
                        value={registerPassword2}
                        onChange={onInputChange} 
                    />
                </div>

                <div className="form-group mb-2" style={{display: 'flex',  justifyContent:'center'}}>
                    <input 
                        type="submit" 
                        className="btnSubmit" 
                        value="Crear cuenta" />
                </div>
                <Link
                    component={RouterLink}
                    to="/auth/login"
                    style={{display: 'flex',  justifyContent:'right'}}
                >
                    Volver al Login
                </Link>
            </form>
        </div>
    )
}
