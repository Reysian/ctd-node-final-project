import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import "../App.css";
import TransactionForm from "../shared/TransactionForm";
import TransactionListItem from "../TransactionListItem";
import AppContext from "../shared/AppContext";

// Dashboard component creates the main page for logged-in users to view and interact with pending transactions on their account
function Dashboard() {
  const [transactions, setTransactions] = useState([{}]);
  const [filteredTransactions, setFilteredTransactions] = useState([{}]);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState({});
  const { errorMessage, setErrorMessage } = useContext(AppContext);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let respData = null;

    try {
      const resp = await fetch("/api/transactions/user", options);
      respData = await resp.json();
      if (!resp.ok) {
        throw new Error(resp.error);
      }

      setUsername(respData.user.name);
      setBalance(respData.user.balance);
    } catch (error) {
      console.log(error);
      setErrorMessage(respData.error);
    }
  };

  // Log out a user
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Get all transactions assigned to the current user and store them in a list
  const loadTransactions = async () => {
    const token = localStorage.getItem("token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let respData = null;

    try {
      const resp = await fetch("/api/transactions", options);
      respData = await resp.json();
      if (!resp.ok) {
        throw new Error(resp.error);
      }

      const fetchedTransactions = respData.transactions.map((transaction) => {
        const currentTransaction = {
          ...transaction,
        };
        return currentTransaction;
      });
      setTransactions(fetchedTransactions);

      const filtered = fetchedTransactions.filter(
        (transaction) => !transaction.submitted,
      );
      setFilteredTransactions(filtered);
    } catch (error) {
      setErrorMessage(respData.error);
      console.log(error);
    } finally {
      console.log("load complete");
    }
  };

  // Add a transaction and update the user's list of transactions
  const addTransaction = async (typeOf, amount, recipient) => {
    const token = localStorage.getItem("token");
    const payload = {
      typeOf,
      recipient_email: recipient,
      amount,
    };

    console.log(payload);

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    let respData = null;

    try {
      const resp = await fetch("/api/transactions", options);
      respData = await resp.json();
      if (!resp.ok) {
        throw new Error(resp.error);
      }
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      setErrorMessage(respData.error);
    }

    loadTransactions();
    getUserInfo();
  };

  // Edit a transaction and update the user's list of transactions
  const editTransaction = async (transaction, typeOf, amount, recipient) => {
    const token = localStorage.getItem("token");
    const payload = {
      typeOf,
      recipient_email: recipient,
      amount,
    };

    console.log(payload);

    const options = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    let respData = null;

    try {
      const resp = await fetch(`/api/transactions/${transaction._id}`, options);
      respData = await resp.json();
      if (!resp.ok) {
        throw new Error(resp.error);
      }
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      setErrorMessage(respData.error);
    } finally {
      console.log("edit complete");
    }

    setIsEditing(false);
    setEditedTransaction({});
    loadTransactions();
    getUserInfo();
  };

  // Delete a transaction and update the user's list of transactions
  const deleteTransaction = async (transaction) => {
    const token = localStorage.getItem("token");
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let respData = null;

    try {
      const resp = await fetch(`/api/transactions/${transaction._id}`, options);
      respData = await resp.json();
      if (!resp.ok) {
        throw new Error(resp.error);
      }
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      setErrorMessage(respData.error);
    } finally {
      console.log("delete complete");
    }

    loadTransactions();
    getUserInfo();
  };

  // Submit a transaction (apply the amount to the user's account), and update the user's list of transactions
  const submitTransaction = async (transaction) => {
    const token = localStorage.getItem("token");
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let respData = null;

    try {
      const resp = await fetch(`/api/transactions/${transaction._id}`, options);
      respData = await resp.json();
      if (!resp.ok) {
        throw new Error(resp.error);
      }
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      setErrorMessage(respData.error);
    } finally {
      console.log("submit complete");
    }

    loadTransactions();
    getUserInfo();
  };

  useEffect(() => {
    getUserInfo();
    loadTransactions();
  }, []);

  // Open the edit form when a transaction is being edited
  const handleEdit = (transaction) => {
    setEditedTransaction(transaction);
    setIsEditing(true);
  };

  return (
    <>
      <h1>Faux Financial</h1>
      <h3>
        Welcome {username}. Your balance is ${Number(balance).toFixed(2)}
      </h3>
      <a onClick={() => handleLogout()}>Logout</a>
      <p style={{ color: "pink" }}>{errorMessage}</p>
      <TransactionForm submitTransaction={addTransaction}>Add</TransactionForm>
      {isEditing && (
        <TransactionForm
          typeOf={editedTransaction.typeOf}
          amount={editedTransaction.amount}
          recipient={editedTransaction.recipientEmail}
          transaction={editedTransaction}
          submitTransaction={editTransaction}
        >
          Edit
        </TransactionForm>
      )}
      <h3>Pending Transactions:</h3>
      <table style={{ fontWeight: "500" }}>
        <thead>
          <tr>
            <th style={{ padding: "1rem" }}>Type of Transaction</th>
            <th style={{ padding: "1rem" }}>Transaction Amount</th>
            <th style={{ padding: "1rem" }}>Recipient Email (if applicable)</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <TransactionListItem
              key={transaction._id}
              transaction={transaction}
              editTransaction={handleEdit}
              deleteTransaction={deleteTransaction}
              submitTransaction={submitTransaction}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Dashboard;
