import React from 'react';
import Invoice from '../Invoice';

function Paid() {
    return (
        <div>
            <Invoice status="paid" />
        </div>
    )
}

export default Paid