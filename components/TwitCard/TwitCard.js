import react from 'react'
import Link from 'next/link'
import { API_SERVER_ROUTE, IMAGES_SERVER_ROUTE } from '../../static-global-variables.json'
import axios from 'axios'
import { formatDistanceToNow, parseISO } from 'date-fns'
import eslocale from 'date-fns/locale/es'


export default function TwitCard (props) {

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
                like: props.user._id
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
                share: props.user._id
            })
        })
    }

    return (
        <div className="twit" >
            <Link href="/twit/[twit_id]" as={`/twit/${props.twit._id}`}>
                <a className="mascara-link-to-twit"></a>
            </Link>
            <div className="twit-head">
                <Link href="/user/[user_id]" as={`/user/${props.twit.ownerDetails[0]._id}`}>
                    <img className="img-twit-owner" src={props.twit.ownerDetails[0].photo} />
                </Link>
                <div className="texto-pequeno">
                    <p><span className="font-weight-bold" >{props.twit.ownerDetails[0].name}</span> • <span className="text-muted">{  formatDistanceToNow(parseISO(props.twit.creation_time), { locale: eslocale})  }</span></p>
                    <p className="twit-message">{props.twit.message}</p>
                </div>
            </div>
            <div className="twit-image-container">
                {/*
                    props.twit.image &&
                        <img className="twit-image" src={`${props.twit.image}`} />
                */}
            </div>
            <div className="twit-foot">
                <p onClick={() => handleLike(props.twit._id)} className="like-btn text-muted">
                    <i id={`like-icon-${props.twit._id}`} className={`fa fa-heart mr-2 ${props.twit.likes.indexOf( props.user._id ) > (-1) && 'text-danger'}`}></i> 
                    <span id={`like-value-${props.twit._id}`} >{props.twit.likes != '' ? props.twit.likes.length : 0}</span>
                </p>
                <p onClick={() => handleShare(props.twit._id)} className="share-btn text-muted">
                    <i id={`share-icon-${props.twit._id}`} className={`fa fa-retweet mr-2 ${props.twit.shares.indexOf( props.user._id ) > (-1) && 'text-success'}`}></i>
                    <span id={`share-value-${props.twit._id}`} >{props.twit.shares != '' ? props.twit.shares.length : 0}</span>
                </p>
                <p className="comment-btn" ><i className="fa fa-comment text-muted mr-2"></i> {props.twit.comments.length}</p>
            </div>
            <style jsx>{`
            .mascara-link-to-twit{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
            .twit {
                padding: 0 15px;
                border-bottom-style: solid;
                border-bottom-color: #cecece;
                border-bottom-width: 1px;
                margin-bottom: 15px;
                position: relative;
            }
            .twit-head {
                display: flex;
            }
            .twit-message {
                white-space: pre-line;
            }
            .twit-foot {
                display: flex;
                justify-content: space-around;
            }
            .img-twit-owner {
                background-color: transparent;
                width: 45px;
                min-width: 45px;
                height: 45px;
                border-radius: 23px;
                margin-right: 6px;
                z-index: 10;
            }
            .twit-image {
                border-radius: 19px;
                margin-bottom: 5px;
                max-height: 276px;
                width: 100%;
                object-fit: cover;
            }
            .like-btn {
                z-index: 10;
            }
            .share-btn {
                z-index: 10;
            }
            .comment-btn {
                z-index: 10;
            }
            `}</style>
        </div>
    )
}