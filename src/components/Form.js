import React, { useState, useEffect } from 'react'
import '../Form.css'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'

const Form = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const url = 'https://fair-cyan-chimpanzee-yoke.cyclic.app/'
    const [invalidUser, setInvalidUser] = useState('')
    const [loading, setLoading] = useState(true)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [success, setSuccess] = useState(false)

    const { token, id } = queryString.parse(location.search)

    const verifyToken = async () => {
        try {
            const { data } = await axios.get(`${url}api/users/verify-token?token=${token}&id=${id}`)
            setLoading(false)
            console.log(data)
        } catch (error) {
            if (error?.response?.data) {
                const { data } = error.response
                if (!data.success) return setInvalidUser(data.error)
                return console.log(error.response.data)
            }
            console.log(error)
        }
    }

    useEffect(() => {
        verifyToken()
    }, [])

    if (invalidUser) return (
        <div>
            <h1>{invalidUser}</h1>
        </div>
    )

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ display: 'block', marginTop: 'auto', marginBottom: 'auto' }}>Loading, wait momentarily...</h1>
        </div>
    )

    const changePassword = async (e) => {
        e.preventDefault()
        if (password.trim().length < 8) {
            console.log('Passwords must be atleast 8 Characters long')
            alert('Passwords must be atleast 8 Characters long.')
        }

        if (password !== confirmPassword) {
            console.log('Your Passwords does not match')
        }

        try {
            const { data } = await axios.post(`${url}api/users/resetPassword?token=${token}&id=${id}`, { password })
            setLoading(false)
            console.log(data)

            if (data.success) {
                navigate('/reset-password')
                alert('Successfullly changed your password, you can now close this window.')
            }
        } catch (error) {
            if (error?.response?.data) {
                const { data } = error.response
                if (!data.success) return setInvalidUser(data.error)
                return console.log(error.response.data)
            }
            console.log(error)
        }
    }

    return (
        <div className='form-container-body'>
            <form className='reset-password-form' onSubmit={changePassword}>
                <p class='reset-password-header'>Reset Password</p>
                <p className="reset-password-subHeader">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>

                <label htmlFor='password' className='reset-password-label'>New password</label><br />
                <input type="password" className="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />

                <label htmlFor='confirmPassword' className='reset-password-label cFirmPwd'>Confirm new password</label><br />
                <input type="password" className="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><br />

                <input type="submit" className='changePwdBtn' value="Change Password" />
            </form>
        </div>
    )
}

export default Form