import React from 'react'
import UserReport from '../components/UserReport'
import { useAuth } from '../auth/AuthContext'


function Team() {
    const {dark} = useAuth()
    return (
        <div>

            <section className={`data-table-bgs_02x24 py-3 ${dark?"bg-dark":""}`}>
                <div className={`container-fluid ${dark?"bg-dark":""}`}>
                    <UserReport />
                </div>
            </section>

           
        </div>
    )
}

export default Team