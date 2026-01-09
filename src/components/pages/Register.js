import React from 'react'
import { useState, useContext } from 'react';
import { DContext } from '../../context/Datacontext';
import LoginImg from '../../assets/undraw_injured_0ynx.png'

const Register = () => {

    const {setIsAuth, setCurrentUser, BeURL} = useContext(DContext)

    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [comparePassword, setComparePassword] = useState(true)

    const handleRegister = async () => {
        setComparePassword(password===confirmPassword)
        if(name!=="" || email!=="" || contact!=="" || password!==""){
            if(password===confirmPassword){
                fetch(`${BeURL}/register`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({ fullname: name, email, contact, password }),
                })
                .then(res=>res.json())
                .then(data=>{
                    if (data.success) {
                        // Signup successful
                        setIsAuth(true)
                        setCurrentUser(data.user)
                        setName('')
                        setEmail('')
                        setContact('')
                        setPassword('')
                        setConfirmPassword('')
                        window.location.href="/"
                    } else {
                        alert(data.message)
                    }
                })
                .catch(err=>{
                    alert('Trouble in connecting to the Server! Please try again later.')
                    console.log('Error in Register: '+err)
                })
        
            }else{
                alert('passwords not match!')
            }
        }
        else{
            alert("All fields are required!")
        }
    }


  return (
    <div className='flex flex-wrap justify-center items-center min-h-[85vh]'>
        <div className='text-center p-2'>
            <img className='mx-auto' src={LoginImg} alt='register-illus' style={{height: '150px'}} />
            <h1 className='text-3xl font-bold text-primary-500 my-2'>Create an Account!</h1>
            <p className='text-base'><small>Enter all the required details and verify your Email for creating a new Account.</small></p>
        </div>
        <div className='text-slate-950 bg-white m-3 p-5 md:w-5/12 rounded border-[1px] border-primary-500'>
            <h2 className='text-center text-primary-500 font-bold text-xl mb-3'>Register</h2>
            <p className='mb-3'>Already have an account? then <a className='text-sky-600' href='/login'>Click here</a></p>
            <form>
            <div className="mb-3">
                <label htmlFor="InputName" className="block text-sm/6 font-medium text-gray-900">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required type="text" className="p-2 rounded-2 border-[1px] rounded border-slate-400 focus:outline-secondary-500 my-2 w-full" id="InputName" placeholder="Your name"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputContact" className="block text-sm/6 font-medium text-gray-900">Contact</label>
                <input value={contact} onChange={(e) => setContact(e.target.value)} required type="number" className="p-2 rounded-2 border-[1px] rounded border-slate-400 focus:outline-secondary-500 my-2 w-full" id="InputContact" placeholder="+91 9876543210"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputEmail" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="p-2 rounded-2 border-[1px] rounded border-slate-400 focus:outline-secondary-500 my-2 w-full" id="InputEmail" placeholder="name@example.com"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputPassword" className="block text-sm/6 font-medium text-gray-900">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="p-2 rounded-2 border-[1px] rounded border-slate-400 focus:outline-secondary-500 my-2 w-full" id="InputPassword" placeholder="••••••••"/>
            </div>
            <div className="mb-3">
                <label htmlFor="InputConfirmPassword" className="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
                <input value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type="password" className="p-2 rounded-2 border-[1px] rounded border-slate-400 focus:outline-secondary-500 my-2 w-full" id="InputConfirmPassword" required placeholder="••••••••"/>
            </div>
            <p className='my-2 ms-3 bagde bg-danger text-red-500'>{comparePassword? '': 'Passwords do not match'}</p>
            <div className='d-flex justify-content-center'>
                <button onClick={handleRegister} type='button' className='rounded-full px-4 py-1 text-md bg-primary-500 hover:bg-secondary-600 text-white'>Register <i className='bi bi-door-open'></i></button>
            </div>
            </form>
        </div>
    </div>
  )
}

export default Register