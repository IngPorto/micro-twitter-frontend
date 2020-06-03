import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { API_SERVER_ROUTE } from '../../static-global-variables.json'
import axios from 'axios'

export default function TwitCard (props) {
    const [ twitMessage, setTwitMessage ] = useState('')
    const [ twitImage, setTwitImage ] = useState(null)

    
    const handleCloseTwitForm = e => {
        document.getElementById('twit-form-layout').classList.add('d-none')
        // and clean all 
        limpiar_twit_form_layout()
    }
    const handleTATwiting = e => {
        setTwitMessage( e.target.value )
        console.log( twitMessage )
    }
    const handleSendTwit = e => {
        e.preventDefault()
        if ( twitMessage.trim() != ''){
            const jsonData = JSON.stringify({
                'message': twitMessage,
                'owner': props.user._id,
                'parent': props.parent || null
            })

            const formData = new FormData();
            formData.append('image',twitImage)
            formData.append('message',twitMessage)
            formData.append('owner', props.user._id)
            props.parent && formData.append('parent', props.parent)

            axios({
                url: API_SERVER_ROUTE + `/api/twit`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': twitImage ? 'multipart/form-data' : 'application/json'
                },
                data: twitImage ? formData : jsonData
            })
            document.getElementById('twit-form-layout').classList.add('d-none')
            limpiar_twit_form_layout()
        } else {
            document.getElementById('twit-form-layout-ta').classList.add('is-invalid')
        }
    }


    const limpiar_twit_form_layout = () => {
        setTwitMessage ('')
        document.getElementById('twit-form-layout-ta').value = ''
        setTwitImage (null)
        //document.getElementById('input-file-twit-image'). files[0] = null
        document.getElementById('twit-imagen-preview').classList.remove('d-block')
        document.getElementById('twit-imagen-preview-alert-messages').classList.remove('d-block')
    }
    

    // imagen de carga
    const obtenerElArchivoSeleccionado = e => {
        document.getElementById('twit-imagen-preview').classList.remove('d-block')
        document.getElementById('twit-imagen-preview-alert-messages').classList.remove('d-block')

        console.log('----Target----')
        console.log(e.target)
        console.log('----File----')
        console.log(e.target.files[0])
        // metadatos de la imagen
        const imagen = e.target.files[0]
        if ( !imagen ) return;

        // imágenes soportadas
        const imagenesSoportadas = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        const isSoported = imagenesSoportadas.indexOf( imagen.type ) > (-1)
        console.log( isSoported ? 'imagen soportada' : 'imagen NO soportada')
        // crearPreviewDeLaImagen ( imagen)
        if ( !isSoported ){
            document.getElementById('twit-imagen-preview-alert-messages').innerText = 'Tipo de archivo no soportado. Prueba con una imagen JPEG, JPG, PNG o GIF.'
            document.getElementById('twit-imagen-preview-alert-messages').classList.add('d-block')
            return;
        }
        if ( imagen.size > 3000000 ){
            document.getElementById('twit-imagen-preview-alert-messages').innerText = 'El tamaño el archivo no puede exceder los 3 Mb.'
            document.getElementById('twit-imagen-preview-alert-messages').classList.add('d-block')
            return;
        }
        const imagenCodificada = URL.createObjectURL(imagen)
        document.getElementById('twit-imagen-preview').src = imagenCodificada
        document.getElementById('twit-imagen-preview').classList.add('d-block')
        setTwitImage (imagen)
    }

    useEffect(() =>{
        const inputFileRef = document.getElementById('input-file-twit-image')
        if ( inputFileRef ){
            inputFileRef.addEventListener('change', obtenerElArchivoSeleccionado)
            return () => {
                inputFileRef.removeEventListener('change', obtenerElArchivoSeleccionado);
            }
        }
    },[twitImage])

    return (
        <div>
            <div id="twit-form-layout" className="twit-form-layout d-none">
                <form className="twit-form-layout-form" onSubmit={handleSendTwit}>
                    <div className="twit-form-layout-head mb-3">
                        <span onClick={handleCloseTwitForm} className="close-twitForm-button text-primary font-weight-bold h3"><i className="fa fa-times"></i></span>
                        <button type="submit" className="btn btn-primary font-weight-bold twit-boton">Enviar</button>
                    </div>
                    <textarea id="twit-form-layout-ta" onChange={handleTATwiting} className="twit-form-layout-ta form-control text-white" placeholder="¿Qué estás pensando?"></textarea>
                    <img id="twit-imagen-preview" src="" className="d-none" />
                    <p id="twit-imagen-preview-alert-messages" className="d-none"></p>
                    <input type="file" name="image" id="input-file-twit-image"/>
                    <div className="btn-upload-image" onClick={() => { document.getElementById('input-file-twit-image').click() }}><i className="fa fa-camera"></i></div>
                </form>
            </div>
            <style jsx>{`

            
            .twit-form-layout {
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                width: 100vw;
                background-color: #1f1f1f;
                z-index: 100;
            }
            .twit-form-layout-form {
                width: 100%;
                padding: 15px;
            }
            .twit-form-layout-head{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .twit-boton {
                border-radius: 19px;
                padding-left: 17px;
                padding-right: 17px;
            }
            .twit-form-layout-ta {
                resize: none;
                min-width: 100%;
                min-height: 200px;
                background: transparent;
            }
            .twit-form-layout-ta::placeholder {
                color: #5c94c5;
            }

            #twit-imagen-preview {
                height: 183px;
                border-radius: 15px;
                margin: 10px auto;
                max-width: 100%;
                object-fit: cover;
            }
            #twit-imagen-preview-alert-messages {
                color: #d86161;
            }
            #input-file-twit-image {
                display:none;
            }
            .btn-upload-image {
                color: #5c94c5;
                border-style: solid;
                border-width: 1px;
                border-radius: 20px;
                padding: 25px 32px;
                font-size: 3em;
                width: fit-content;
                margin: 10px auto 0 auto;
            }
            .btn-upload-image:hover {
                background-color: #3b405478;
            }

            `}</style>
        </div>
    )
}