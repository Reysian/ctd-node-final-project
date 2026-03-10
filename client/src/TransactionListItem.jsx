import { useState, useEffect } from "react";

// TransactionListItem component creates a single list item that displays a transaction with options to edit/delete/submit the transaction
function TransactionListItem({
  transaction,
  editTransaction,
  deleteTransaction,
  submitTransaction,
}) {
  const [workingTransaction, setWorkingTransaction] = useState({
    ...transaction,
  });

  useEffect(() => {
    const refresh = () => {
      setWorkingTransaction({
        ...transaction,
        amount: Number(transaction.amount).toFixed(2),
      });
    };

    refresh();
  }, [transaction]);

  return (
    <tr key={transaction._id}>
      <td>{workingTransaction.typeOf}</td>
      <td>${workingTransaction.amount}</td>
      <td>{workingTransaction.recipientEmail || "None"}</td>
      <td>
        <a
          style={{ padding: "0.2rem" }}
          onClick={() => editTransaction(transaction)}
        >
          Edit
        </a>
      </td>
      <td>
        <a
          style={{ padding: "0.2rem" }}
          onClick={() => deleteTransaction(transaction)}
        >
          Delete
        </a>
      </td>
      <td>
        <a
          style={{ padding: "0.2rem" }}
          onClick={() => submitTransaction(transaction)}
        >
          Submit
        </a>
      </td>
    </tr>
  );
}

export default TransactionListItem;
