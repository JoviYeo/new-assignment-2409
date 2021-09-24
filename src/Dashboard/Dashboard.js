import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

export default function Dashboard({ setToken }) {
    const [balance, setBalance] = useState('');
    const [transactions, setTransactions] = useState([]);
    const history = useHistory();

    async function getBalanceApi() {
        return fetch('http://localhost:8080/account/balances', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')

            }
        }).then(data => data.json());
    }

    async function getTransactionApi() {
        return fetch('http://localhost:8080/account/transactions', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(data => data.json());
    }

    const getBalance = async e => {
        const response = await getBalanceApi();
        if (response && response.status === 'success') {
            setBalance(response.balance);
        }
    }

    const getTransaction = async e => {
        const response = await getTransactionApi();
        if (response && response.status === 'success') {
            setTransactions(response.data);
        }
    }

    const logout = () => {
        setToken(null);
        localStorage.clear();
    }

    useEffect(() => {
        getBalance();
        getTransaction();
    }, []);

    const prepareDate = date => {
        const d = new Date(date);
        let day = d.getDate().toString();
        let month = (d.toLocaleString('en-us', { month: 'short' }));

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [day, month].join(' ');
    };

    const displayTransactions = value => {
        return (
            <>{
                value.map(option =>
                (
                    <div className='transaction-history'>
                        <div className='col side'><b>{prepareDate(option.date)}</b></div>
                        <div className='col center'>
                            {
                                (option.type === 'transfer') ?
                                    (' Transfer to ' + (option.to['accountHolderName'])) :
                                    (' Received from ' + (option.from['accountHolderName']))
                            }
                        </div>
                        <div className='col amount side'>
                            <b>{
                                (option.type === 'transfer') ?
                                    (' -' + option.amount) :
                                    (<text className='green'>{option.amount}</text>)
                            }</b>
                        </div>
                    </div>
                )
                )
            }
            </>
        )
    }

    const handleClick = () =>{
        history.push('/transfer')
    }

    return (
        <div className="dashboard">
            <div className='logout'>
                <button className='text-button' onClick={logout}> Log Out</button>
            </div>
            <div className='balance'>
                <div className='balance-label'>You have</div>
                <div className='balance-label'><b>SGD {balance}</b></div>
                <div className='balance-label'> in your account</div>
            </div>
            <span className='divider'></span>
            <div className='activity'>
                <label className='activity-label'>Your activity</label>
            </div>
            {displayTransactions(transactions)}
            <div className='transfer'>
                <button className='text-button' onClick={handleClick}>Make a transfer</button>
            </div>
        </div>
    );
}