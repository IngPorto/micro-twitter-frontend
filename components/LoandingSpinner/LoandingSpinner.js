import React from 'react'
import spiner from '../../public/images/spin1.svg'

export default function LoandingSpinner () {

    return (
        <div className="spiner">
            <img src={'/images/spin1.svg'} alt="...Loading"/>

            <style jsx>{`
                .spiner {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    background-color: rgba(0, 0, 0, 0.05);
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    
                }
                .spiner > img {
                    height: 45px;
                }
            `}</style>
        </div>
    )
}