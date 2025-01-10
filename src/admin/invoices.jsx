import React from 'react'
import Invoice from '../pages/Invoice'
import { useAuth } from '../auth/AuthContext'

function invoices() {
    const {dark} = useAuth()
    return (
        <div className={`${dark?"bg-dark":""}`}>
            <Invoice />
        </div>
    )
}

export default invoices