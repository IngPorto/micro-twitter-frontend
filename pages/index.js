import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { API_SERVER_ROUTE } from '../static-global-variables.json'
import Landing from '../components/Landing/Landing'
import LoandingSpinner from '../components/LoandingSpinner/LoandingSpinner'
import Wall from '../components/Wall/Wall'

export default function Home() {
  const [ user, setUser ] = useState()
  const [ isCheckedSession, setCheckedSession ] = useState( false )

  const checkSession = async ()=>{
    setCheckedSession(false)
    const res = await fetch( API_SERVER_ROUTE + '/api/user/session',{credentials: 'include'})
    const sessionPrevia = await res.json()
    if (sessionPrevia){
      setUser(sessionPrevia)
      console.log("sesión previa encontrada")
      console.log(sessionPrevia)
    }
    await setCheckedSession(true)
  }

  useEffect( ()=>{
    checkSession()
  },[])

  const test = async ()=>{
    const res = await fetch( API_SERVER_ROUTE + '/api/twit/',
    {
      method: 'POST',
      body: JSON.stringify({
        "message": 'Testing 2',
        "owner": '5eaf47130b29bb337c8bc41b'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const twits = await res.json()
    if (twits){
      console.log(".........")
      console.log(twits)
    }
  }
  

  return (
    <div className="container-fluid app">
      <Head>
        <title>Micro Twitter</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"></link>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="stylesheet" href="https://raw.githubusercontent.com/daneden/animate.css/master/animate.css" />
      </Head>

      <main>
        { 
          isCheckedSession ? 
            !user ?
              <Landing user={user} setUser={setUser}/>
              :
              <Wall user={user} setUser={setUser} />
            :
            <LoandingSpinner />
        }

      </main>

      { /*Scripts*/ }
      <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossOrigin="anonymous"></script>


      <style jsx>{`
      .app {
        margin: 0;
        padding: 0;
      }
      `}</style>

      <style jsx global>{`

      `}</style>
    </div>
  )
}
