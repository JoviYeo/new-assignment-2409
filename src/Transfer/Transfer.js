import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from 'react-router-dom';

export default function Transfer() {
    const [payee, setPayee] = useState([]);
    const [description, setDescription] = useState([]);
    const [amount, setAmount] = useState([]);
    const [date, setDate] = useState('');
    const [recipientAccountNo, setRecipientAccountNo] = useState('');
    const [error, setError] = useState('')
    const history = useHistory();

    async function getPayeeApi() {
        return fetch('http://localhost:8080/account/payees', {
            method: 'get',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(data => data.json());
    }

    const getPayee = async e => {
        const response = await getPayeeApi();
        if (response && response.status === 'success') {
            setPayee(response.data);
        }
    }

    useEffect(() => {
        getPayee();
        displayPayee(payee);
    }, []);

    async function transferDetails(details) {
        if(details.date) {
            details.date = new Date(date).toISOString();
        }
        return fetch('http://localhost:8080/transfer', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        }).then(data => data.json())
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await transferDetails({
            recipientAccountNo,
            description,
            amount,
            date
        });
        if (response && response.status === 'success') {
            setError('Successfully Transferred');
        } else {
            setError(response.description);
        }
    }

    const handleClick = () => {
        history.push('/dashboard')
    }

    const displayPayee = (value) => {
        return (
            value.map(options =>
                <option value={options.accountNo}>{options.accountHolderName}</option>
            ))
    }

    return (
        <div>
            <h2>Make a transfer</h2>
            <div className="transfer-container">
                <Form onSubmit={handleSubmit}>
                    <Form.Group size="lg" controlId="recipientAccountNo">
                        <Form.Control
                            as="select"
                            value={recipientAccountNo}
                            onChange={e => {
                                setRecipientAccountNo(e.target.value);
                            }}
                        >
                            <option className='disabled' value='' disabled>Please select a recipient</option>
                            {displayPayee(payee)}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group size="lg" controlId="date">
                        <Form.Control
                            placeholder='Date of transfer'
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="description">
                        <Form.Control
                            placeholder='Description'
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="amount">
                        <Form.Control
                            placeholder='Amount'
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </Form.Group>
                    {error ? <p>{error}</p> : null}
                    <button className="text-button cancel" onClick={handleClick}>Cancel</button>
                    <button className="text-button" type="submit"><b>Submit</b></button>
                </Form>
            </div>
        </div>
    );
}