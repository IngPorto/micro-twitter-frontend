import React, { useState, isValidElement } from 'react'
import { API_SERVER_ROUTE } from '../../static-global-variables.json'
import bg_imagen from '../../public/images/bg.jpg'
import validator from 'validate.js'

export default function Landing(props) {
	const [name, setName] = useState()
	const [slug, setSlug] = useState()
	const [password, setPassword] = useState()
	const [feedbackMsn, setFeedBk] = useState()
	const [isAccount, setIsAccount] = useState(true)

	const handleSubmit = async (e) => {
		e.preventDefault()

		if ( isAccount ){
			if (!camposValidos ('login')) return;

			const auth = await fetch(API_SERVER_ROUTE + '/api/user/auth', {
				method: 'POST',
				body: JSON.stringify({
					slug,
					password
				}),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})
			const response = await auth.json()
			if (response) {
				await props.setUser(response)
			}else {
				// Usuario no encontrado
				//console.log(feedbackMsn)
				await (feedbackMsn.innerHTML = 'Usuario desconocido')
				await feedbackMsn.classList.add("d-block");
				await feedbackMsn.classList.add("text-danger");
			}
			console.log(response)
		} else {
			if (!camposValidos ('create_new_user')) return;

			const newUser = await fetch(API_SERVER_ROUTE + '/api/user', {
				method: 'POST',
				body: JSON.stringify({
					name,
					slug,
					password
				}),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})
			const response = await newUser.json()
			if (response) {
				await props.setUser(response)
			}else {
				// Usuario no encontrado
				//console.log(feedbackMsn)
				await (feedbackMsn.innerHTML = 'Error en la creación del usuario, intenta más tarde')
				await feedbackMsn.classList.add("d-block");
				await feedbackMsn.classList.add("text-danger");
			}
			// Después de crear un usuario inicio sesión en el servidor
			await fetch(API_SERVER_ROUTE + '/api/user/auth', {
				method: 'POST',
				body: JSON.stringify({
					slug,
					password
				}),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})
		}
	}

	/**
	 * Validación de los campos del formulario de inicio para iniciar sesión o registrarse
	 * @param {string} actionType tipo de acción que se realiza en el formulario: 'login' || 'create_new_user'
	 */
	const camposValidos = actionType => {
		let isValidFields = true

		if ( actionType == 'create_new_user'){
			if ( !validator.isDefined(name) || !(/^[a-zA-Z0-9\_]*$/.test(name)) || (typeof name == 'string' && name.length < 2 ) ){
				// nickname invalido
				document.getElementById('name-input').classList.add('is-invalid')
				isValidFields = false;
			}
		}

		if ( !validator.isDefined(slug) || !(/^[a-zA-Z0-9\_]*$/.test(slug)) || (typeof slug == 'string' && slug.length < 2 ) ){
			// nickname invalido
			document.getElementById('slug-input').classList.add('is-invalid')
			isValidFields = false;
		}
		
		if ( !validator.isDefined(password) || (typeof password == 'string' && password.length < 2) ){
			// password invalido
			document.getElementById('password-input').classList.add('is-invalid')
			isValidFields = false;
		}
		
		return isValidFields
	}

	const handleChangeInputValue = e => {
		switch (e.target.name) {
			case 'name': setName(e.target.value); break;
			case 'slug': setSlug(e.target.value); break;
			case 'password': setPassword(e.target.value); break;
		}
		console.log(e.target.value)
	}

	const handleFormBehavior = ()=> {
		setIsAccount( prevIA => !prevIA )
	}

	return (
		<div className="landing">
			<nav className="nav">
				<a className="nav-link active mt-text h5 text-white">Micro Twitter • <span className="share-you lead">share you</span></a>
			</nav>
			<div className="header">
				<div className="centrador">
					<div className="titulos container">
						<p className="h1 text-white">Escribe y comparte</p>
						<p className="h1 text-white">Esto no es un Twitter, pero casi.</p>
						<p className="text-white">Aquí encontrarás un ambiente creado con el stack MERN.</p>
					</div>
					<div className="container">
						<div className="user-action-form card">
							<div className="card-body p-4">
								<p className={`h5 mb-3 ${ !isAccount && 'd-none'}`}>Inicia</p>
								<p className={`h5 mb-3 ${ isAccount && 'd-none'}`} >Crea tu usuario</p>
								<form onSubmit={handleSubmit}>
									<input id="name-input" className={`form-control mb-3 ${ isAccount && 'd-none'}`} type="text" placeholder="nombre" name="name" onChange={handleChangeInputValue} />

									<input id="slug-input" className="form-control mb-3" type="text" placeholder="nickname" name="slug" onChange={handleChangeInputValue} />
									
									<input id="password-input" className="form-control mb-3" type="password" placeholder="contraseña" name="password" onChange={handleChangeInputValue} />
									
									<p className="feedback-message d-none" id="feedback-message" ref={ref => setFeedBk(ref)}></p>
									
									<button className={`btn btn-success btn-sm btn-block mb-3 ${ !isAccount && 'd-none'}`} type="submit">Entrar</button>
									
									<button className={`btn btn-info btn-sm btn-block mb-3 ${ isAccount && 'd-none'}`} type="submit">Registrarme</button>
									
									<p onClick={handleFormBehavior} className={`mb-0 text-center text-primary ${ !isAccount && 'd-none'}`}>No tengo cuenta</p>
									<p onClick={handleFormBehavior} className={`mb-0 text-center text-primary ${ isAccount && 'd-none'}`}>Ya tengo una cuenta</p>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div className="sign">
					<p className="text-white text-center">@ingporto</p>
				</div>
				<div className="oscurecedor"></div>

			</div>
			<style jsx>{`
			.nav {
				background-color: #000!important;
				z-index: 2;
				position: fixed;
				width: 100vw;
				top: 0;
			}
			.mt-text {
			}
			.share-you {
				font-size: 0.95rem;
			}
			.black-bg {
				background-color: #1c1c1c
			}
			.header {
				background: url(/images/bg.jpg);
				background-repeat: no-repeat;
				background-size: cover;
				background-position-x: center;
				height: 100vh;
				width: 100vw;
				position: absolute;
				top: 0;
				z-index: 1;
				display: flex;
			}
			.centrador {
				margin: auto;
			}
			.feedback-message {
			}
			.sign {
				position: fixed;
				left: 0;
				bottom: 0;
				width: 100vw;
			}
			.sign p {

			}
			.oscurecedor {
				background-color: rgba(0, 0 ,0 ,0.5);
				position: absolute;
				top: 0;
				left: 0;
				height: 100vh;
				width: 100vw;
				z-index: -2;
			}
			`}</style>
		</div>
	)
}