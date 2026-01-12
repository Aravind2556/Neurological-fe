import React, {useState, useContext} from 'react'
import { DContext } from '../../context/Datacontext'
import LoginImg from '../../assets/undraw_injured_0ynx.png'

const Login = () => {

    const {setIsAuth, setCurrentUser, BeURL} = useContext(DContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const HandleLogin = async (e)=> {

        e.preventDefault()

        if(email!=="" && password!==""){
            fetch(`${BeURL}/login`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials: "include",
                body:JSON.stringify({
                    email, password
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.success){
                    setIsAuth(true)
                    setCurrentUser(data.user)
                    setEmail('')
                    setPassword('')
                    window.location.href="/"
                }else{
                    alert(data.message)
                }
            })
            .catch(err=>{
                alert('Trouble in connecting to the Server! Please try again later.')
                console.log('Error in Login:',err)
            })
        }
        else{
            alert("All fields are required!")
        }
   
    }


  return (
    <div className='flex flex-wrap justify-center items-center' style={{minHeight: '85vh'}}>
        <div className='text-center p-3'>
            <img className='mx-auto' src={LoginImg} alt='signin-illus' style={{height: '150px'}} />
            <h1 className='text-3xl font-bold my-3 text-teal-500'>Welcome Back!</h1>
            <p className='text-base'><small>Enter your registered Email and Password for accesing your user account.</small></p>
        </div>
        <div className='bg-slate-100 text-slate-950 m-3 p-5 w-full md:w-5/12 rounded-md'>
            <h2 className='text-center text-teal-500 text-xl mb-3 font-bold'>Login</h2>
            <p className='my-3'>Don't have an account? then <a className='text-sky-500' href='/register'>Click here</a></p>
            <form>
            <div className="mb-3">
                <label htmlFor="InputEmail" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                <input value={email} onChange={(e)=>{setEmail(e.target.value)}} required type="email" className="p-2 rounded-2 border-[1px] rounded border-slate-400 focus:outline-teal-500 my-2 w-full" id="InputEmail" placeholder="name@mail.com"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputPassword" className="block text-sm/6 font-medium text-gray-900">Password</label>
                <input value={password} onChange={(e)=>{setPassword(e.target.value)}} required type="password" className="p-2 rounded-2 border-[1px] rounded border-slate-400 focus:outline-teal-500 my-2 w-full" id="InputPassword" placeholder="••••••••"/>
            </div>
            <div className='d-flex justify-content-center'>
                <button onClick={HandleLogin} type='submit' className='rounded-full px-4 py-1 text-md bg-teal-500 hover:bg-teal-600 text-white font-medium'>Login <i className='bi bi-box-arrow-in-right'></i></button>
            </div>
            </form>
        </div>
    </div>
  )
}

export default Login