import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { API_SERVER_ROUTE, IMAGES_SERVER_ROUTE } from '../../static-global-variables.json'
import axios from 'axios'
import { formatDistanceToNow, parseISO } from 'date-fns'
import eslocale from 'date-fns/locale/es'
import LoandingSpinner from '../../components/LoandingSpinner/LoandingSpinner'
import TwitCard from '../../components/TwitCard/TwitCard'

export default () => {
    const router = useRouter()
    const [ user, setUser ] = useState() // el usuario en sesión
    const [ userProfileView, setUserProfileView ] = useState() // el perfil de usuario observado
    const [ userId , setUserId ] = useState()
    const [ userTwits , setUserTwits ] = useState()
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

    /**
     * Comprovación de sesión
     */
    useEffect( ()=>{
        checkSession()
    },[])

    /**
     * Efecto para obtener el ID de la ruta una vez la página ya esté lista
     */
    useEffect( () => {
        setUserId(router.query.user_id)
    }, [router])

    /**
     * Efecto para obtener los datos del usuario según el ID proporcionado
     */
    useEffect( () => {
        let cancel
        axios({
            url: API_SERVER_ROUTE + `/api/user/${userId}`,
            method: 'GET',
            cancelToken: new axios.CancelToken( c => cancel = c)
        }).then(res => {
            if ( res.data ){
                console.log( res.data )
                setUserProfileView( res.data )
                //setUserTwits (null)
            }
        }).catch (e =>{
            if (axios.isCancel(e)) return
        })
        return () => cancel()
    }, [userId])


    /**
     * Efecto para cargar los twits del perfil del usuario
     */
    useEffect( ()=>{
        if ( userProfileView ){
            let cancel
            axios({
                url: API_SERVER_ROUTE + `/api/twit/user/${userId}`,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                cancelToken: new axios.CancelToken( c => cancel = c)
            }).then(res => {
                if ( res.data[0] ){
                    console.log('opteniendo los twits del perfil de usuario')
                    console.log(res.data)
                    setUserTwits( res.data )
                }
            }).catch (e =>{
                if (axios.isCancel(e)) return
            })
            return () => cancel()
        }
    },[userProfileView])

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
            document.getElementById('user-profile-follow-info').innerText = res.data.followers.indexOf( user._id ) == (-1) ? 'Seguir': 'Dejar de seguir'
            setFollowState(res.data.followers.indexOf( user._id ) == (-1) ? 'Seguir': 'Dejar de seguir')
        })
    },[user, followState])

    useEffect( () => {
        if ( document.getElementById('user-profile-follow-info') ){
            document.getElementById('user-profile-follow-info').innerText = followState
        }
    }, [followState])

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
                <p className="header-title mb-0 font-weight-bold">
                    {
                        userProfileView &&
                            userProfileView.name
                    }
                </p>
            </div>
            {
                userProfileView ?
                    <div className="user-profile">
                        <div className="user-head pl-3 pr-3 mb-2">
                            <div className="img-user-profile-container">
                                <img className="img-user-profile" src={userProfileView.photo}/>
                            </div>
                            <div className="user-profile-info">
                                <p className="user-profile-name h2 font-weight-lighter m-0" >{userProfileView.name}</p>
                                <p className="user-profile-antique text-muted" ><small>Antigüedad {formatDistanceToNow(parseISO(userProfileView.creation_time), { locale: eslocale})}</small></p>
                            {
                            ( user && userProfileView._id != user._id ) &&
                                <button 
                                    type="button" 
                                    className={`btn btn-sm ${userProfileView.followers.indexOf( user._id ) == (-1) ? 'btn-primary': 'btn-secondary'}`} 
                                    onClick={ () => handleSeguir(userProfileView._id) }>
                                    <span id="user-profile-follow-info">
                                        { userProfileView.followers.indexOf( user._id ) == (-1) ? 'Seguir': 'Dejar de seguir' }
                                    </span>
                                </button>
                            }
                            </div>
                        </div>
                        <div className="border-bottom-custom user-profile-description">
                            {
                                userProfileView.description
                            }
                        </div>
                        <div className="border-bottom-custom user-profile-stadistics pt-2 pb-2 text-14 line-height-20">
                            <div className="text-center">
                                <p className="m-0 font-weight-bold text-muted">{ userProfileView.following.length }</p>
                                <p className="m-0 text-muted">siguiendo</p>
                            </div>
                            <div className="text-center">
                                <p className="m-0 font-weight-bold text-muted">{ userProfileView.followers.length }</p>
                                <p className="m-0 text-muted">siguidores</p>
                            </div>
                        </div>
                        {
                            userTwits &&
                            <div className="user-twits pt-3">
                                {
                                    userTwits.map(userTwit => {
                                        return(
                                            <TwitCard twit={userTwit} user={user} key={userTwit._id}/>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                    :
                    <>Loading...</>
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


                .text-14 {
                    font-size: 14px;
                }
                .line-height-20 {
                    line-height: 20px;
                }


                .user-head {
                    display: flex;
                }



                .img-user-profile-container {
                    height: 100px;
                    width: 100px;
                    border-radius: 50px;
                    border-color: #bbbbbb;
                    border-style: solid;
                    border-width: 1px;
                    padding: 5px;
                    margin-right: 28px;
                }
                .img-user-profile-container img {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                    margin: auto;
                    display: block;
                    border-style: solid;
                    border-radius: 50px;
                    border-width: 1px;
                    border-color: #bbbbbb;
                }




                .user-profile-description {
                    padding: 0 16px 21px;
                    line-height: 20px;
                    font-size: 14px;
                }
    

                .user-profile-stadistics {
                    display: flex;
                    justify-content: space-evenly;
                }



                .border-bottom-custom {
                    border-bottom-style: solid;
                    border-bottom-color: #cacaca;
                    border-bottom-width: 0.5px;
                }


            `}</style>
        </div>
    )
}