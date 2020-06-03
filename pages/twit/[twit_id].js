import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { API_SERVER_ROUTE, IMAGES_SERVER_ROUTE } from '../../static-global-variables.json'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import eslocale from 'date-fns/locale/es'
import LoandingSpinner from '../../components/LoandingSpinner/LoandingSpinner'
import TwitCard from '../../components/TwitCard/TwitCard'
import TwitForm from '../../components/TwitForm/TwitForm'

 const Twit = () => {
    const router = useRouter()
    const [ twitID, setTwitID ] = useState() 
    const [ twit, setTwit ] = useState() 
    const [ comments, setComments ] = useState() 
    const [ user, setUser ] = useState()
    const [ followState, setFollowState ] = useState()

    const checkSession = async ()=>{
        const res = await fetch( API_SERVER_ROUTE + '/api/user/session',{credentials: 'include'})
        const sessionPrevia = await res.json()
        if (sessionPrevia){
            setUser(sessionPrevia)
            console.log("sesión previa encontrada")
            console.log(sessionPrevia)
        }
    }

    
    useEffect( ()=>{
        checkSession()
    },[])
  

    /**
     * Efecto para obtener el id del twit una vez la página ya esté lista
     */
    useEffect( () => {
        setTwitID(router.query.twit_id)
    }, [router])

    /**
     * Efecto para cargar los datos del twit del servidor
     */
    useEffect( ()=>{
        let cancel
        axios({
            url: API_SERVER_ROUTE + `/api/twit/${twitID}`,
            method: 'GET',
            cancelToken: new axios.CancelToken( c => cancel = c)
        }).then(res => {
            if ( res.data[0] ){
                console.log( res.data[0] )
                setTwit( res.data[0] )
                setComments (null)
            }
        }).catch (e =>{
            if (axios.isCancel(e)) return
        })
        return () => cancel()
    },[twitID])

    /**
     * Efecto para cargar los comentarios del twit
     */
    useEffect( ()=>{
        if ( twit ){
            let cancel
            axios({
                url: API_SERVER_ROUTE + `/api/twit/comments`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    comments: twit.comments
                }),
                cancelToken: new axios.CancelToken( c => cancel = c)
            }).then(res => {
                if ( res.data[0] ){
                    console.log('opteniendo los comentarios')
                    console.log(res.data)
                    setComments( res.data )
                }
            }).catch (e =>{
                if (axios.isCancel(e)) return
            })
            return () => cancel()
        }
    },[twit])


    const handleLike = twitId => {
        document.getElementById(`like-icon-${twitId}`).classList.toggle('text-danger')
        if ( document.getElementById(`like-icon-${twitId}`).classList.contains('text-danger') ){
            document.getElementById(`like-value-${twitId}`).innerText = parseInt(document.getElementById(`like-value-${twitId}`).innerText) + 1
        }else {
            document.getElementById(`like-value-${twitId}`).innerText = parseInt(document.getElementById(`like-value-${twitId}`).innerText) - 1
        }
        axios({
            url: API_SERVER_ROUTE + `/api/twit/like/${twitId}`,
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                like: user._id
            })
        })
    }

    const handleShare = twitId => {
        document.getElementById(`share-icon-${twitId}`).classList.toggle('text-success')
        if ( document.getElementById(`share-icon-${twitId}`).classList.contains('text-success') ){
            document.getElementById(`share-value-${twitId}`).innerText = parseInt(document.getElementById(`share-value-${twitId}`).innerText) + 1
        }else {
            document.getElementById(`share-value-${twitId}`).innerText = parseInt(document.getElementById(`share-value-${twitId}`).innerText) - 1
        }
        axios({
            url: API_SERVER_ROUTE + `/api/twit/share/${twitId}`,
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                share: user._id
            })
        })
    }

    const handleSeguir = useCallback ( twitOwnerId => {
        axios({
            url: API_SERVER_ROUTE + `/api/user/follow/${twitOwnerId}`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                followerId: user._id
            })
        }).then( res => {
            console.log(res.data)
            document.getElementById('twit-follow-owner').innerText = res.data.followers.indexOf( user._id ) == (-1) ? 'Seguir': 'Dejar de seguir'
            setFollowState(res.data.followers.indexOf( user._id ) == (-1) ? 'Seguir': 'Dejar de seguir')
        })
    },[user, followState])

    useEffect( () => {
        if ( document.getElementById('twit-follow-owner') ){
            document.getElementById('twit-follow-owner').innerText = followState
        }
    }, [followState])

    const handleReply = e => {
        e.preventDefault()
    }

    /**
     * Visualiza el modal para crear un nuevo twit que tiene como padre el twit visualizado
     * @param {event} e Evento ejecutado en el click
     */
    const handleOpenTwitForm = e => {
        document.getElementById('twit-form-layout').classList.remove('d-none')
    }

    return (
        <div>
            <Head>
                <title>Micro Twitter</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"></link>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
                <link rel="stylesheet" href="https://raw.githubusercontent.com/daneden/animate.css/master/animate.css" />
            </Head>
            <div className="header pt-1 pl-1 mb-3 border-bottom-custom">
                <span className="go-back-btn text-center" onClick={() => window.history.back() }><i className="fa fa-arrow-left"></i></span>
                <p className="header-title mb-0 font-weight-bold">Tweet</p>
            </div>
            {
            twit ? 
                <div className="twit" >
                    <div className="twit-head pl-3 pr-3 mb-2">
                        <Link href="/user/[user_id]" as={`/user/${twit.ownerDetails[0]._id}`}>
                            <img className="img-twit-owner" src={twit.ownerDetails[0].photo}/>
                        </Link>
                        <div className="twit-owner-info font-weight-bold">
                            <p className="twit-owner-name" >{twit.ownerDetails[0].name}</p>
                        {
                        ( user && twit.ownerDetails[0]._id != user._id ) &&
                            <p className="pl-1">• 
                                <span id="twit-follow-owner" className="twit-follow-owner text-primary" onClick={ () => handleSeguir(twit.ownerDetails[0]._id) }>
                                    {
                                        twit.ownerDetails[0].followers.indexOf( user._id ) == (-1) ? 'Seguir': 'Dejar de seguir'
                                    }
                                </span>
                            </p>
                        }
                        </div>
                    </div>
                    <div className="twit-message-container pl-3 pr-3 border-bottom-custom">
                        <p className="twit-message">
                            { twit.message }
                        </p>
                    </div>
                    {
                        twit.image &&
                            <div className="twit-image-container">
                                <img className="twit-image" src={`${twit.image}`}/>
                            </div>
                    }
                    {
                        user &&
                            <div className="twit-interation-options border-bottom-custom">
                                <p onClick={() => handleLike(twit._id)} className="like-btn text-muted mb-1">
                                    <i id={`like-icon-${twit._id}`} className={`fa fa-heart mr-2 ${twit.likes.indexOf( user._id ) > (-1) && 'text-danger'}`}></i> 
                                </p>
                                <p onClick={() => handleShare(twit._id)} className="share-btn text-muted mb-1">
                                    <i id={`share-icon-${twit._id}`} className={`fa fa-retweet mr-2 ${twit.shares.indexOf( user._id ) > (-1) && 'text-success'}`}></i>
                                </p>
                                <p onClick={handleOpenTwitForm} className="comment-btn" ><i className="fa fa-comment text-muted mr-2"></i></p>
                            </div>
                    }
                    {
                        user &&
                            <div className="twit-stadistics border-bottom-custom">
                                <p className="mb-1">
                                    <span id={`like-value-${twit._id}`} className="mr-1">{twit.likes != '' ? twit.likes.length : 0}</span>
                                    <span className="mr-2 text-muted">Me gusta</span>
                                    <span id={`share-value-${twit._id}`} className="mr-1">{twit.shares != '' ? twit.shares.length : 0}</span>
                                    <span className="text-muted">Compartido</span>
                                </p>
                            </div>
                    }
                    <div className="twit-date border-bottom-custom">
                        <p className="mb-1 text-muted">{
                            format ( parseISO(twit.creation_time), 'h:mm aaaa • d LLL. yy', {locale: eslocale}).toString()
                        }</p>
                    </div>

                    { /* Reply Modal */ }
                    <TwitForm user={user} parent={twitID}/>

                    {
                        comments &&
                        <div className="twit-comments pt-3">
                            {
                                comments.map(comment => {
                                    return(
                                        <TwitCard twit={comment} user={user} key={comment._id}/>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
                :
                <div>Loading...</div>
                /* <LoandingSpinner /> */
            }

            { /*Scripts*/ }
            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script>

            <style jsx>{`
            .header {
                display: flex;
                align-items: center;
            }
            .go-back-btn {
                font-size: 1.5em;
                height: 45px;
                width: 45px;
            }


            .border-bottom-custom {
                border-bottom-style: solid;
                border-bottom-color: #cacaca;
                border-bottom-width: 0.5px;
            }


            .twit-head {
                display: flex;
            }
            .twit-head-text-container {
                display: flex;
                align-items: center;
            }
            .twit-owner-info {
                display: flex;
            }
            .img-twit-owner {
                background-color: transparent;
                width: 45px;
                min-width: 45px;
                height: 45px;
                margin-right: 6px;
                z-index: 10;
            }
            .twit-message {
                white-space: pre-line;
            }


            .twit-image {
                margin-bottom: 5px;
                width: 100%;
                object-fit: cover;
            }

            .twit-interation-options {
                display: flex;
                justify-content: space-evenly;
                font-size: 1.4em;
            }

            .twit-stadistics {
                padding: 3px 15px;
            }

            .twit-date {
                padding: 3px 15px;
                font-size: 0.8em;
            }
            `}</style>
        </div>
    )
}

export default Twit