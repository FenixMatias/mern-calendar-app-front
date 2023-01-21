import { useEffect } from 'react';
import { Link, Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore, useForm } from '../../hooks';
import './LoginPage.css';

const loginFormFields = {
    loginEmail: '',
    loginPassword: '',
}

export const LoginPage = () => {

    const { startLogin, errorMessage } = useAuthStore();

    const { loginEmail, loginPassword, onInputChange } = useForm(loginFormFields);

    const loginSubmit = (event) => {

        event.preventDefault();

        startLogin({email: loginEmail, password: loginPassword});
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
        <div className="container login-container">
            <div className="row">
                <div className="col-md-12 login-form-1">
                    <h3  className="mt-4">Ingreso</h3>
                    <form onSubmit={loginSubmit}>
                        <div className="form-group mb-4">
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Correo"
                                name="loginEmail"
                                value={loginEmail}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="loginPassword"
                                value={loginPassword}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="form-group mb-4" style={{display: 'flex',  justifyContent:'center'}}>
                            <input 
                                type="submit"
                                className="btnSubmit"
                                value="Login" 
                            />
                        </div>
                        <Link
                            component={RouterLink}
                            to="/auth/register"
                            style={{display: 'flex',  justifyContent:'right'}}
                        >
                            Crear una cuenta
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

