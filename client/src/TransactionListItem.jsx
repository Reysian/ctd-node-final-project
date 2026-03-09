import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

function TransactionListItem({ transaction, editTransaction, deleteTransaction, submitTransaction }) {
    const [workingTransaction, setWorkingTransaction] = useState({...transaction});

    useEffect(() => {
        const refresh = () => {
            setWorkingTransaction({...transaction});
        }

        refresh();
    }, [transaction]);

    return (
        <tr key={transaction._id}>
            <td>{workingTransaction.typeOf}</td>
            <td>{workingTransaction.amount}</td>
            <td>{workingTransaction.recipientEmail}</td>
            <td onClick={() => editTransaction(transaction)}>Edit</td>
            <td onClick={() => deleteTransaction(transaction)}>Delete</td>
            <td onClick={() => submitTransaction(transaction)}>Submit</td>
        </tr>
    );
};

export default TransactionListItem;