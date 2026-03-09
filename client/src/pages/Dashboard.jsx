import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";
import TransactionForm from "../shared/TransactionForm";
import TransactionListItem from "../TransactionListItem";
import AppContext from "../shared/AppContext";

function Dashboard() {
  const [transactions, setTransactions] = useState([{}]);
  const [filteredTransactions, setFilteredTransactions] = useState([{}]);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
      const resp = await fetch('/api/transactions', options);
      respData = await resp.json();
      if (!resp.ok) {
        throw new Error(resp.error);
      }
      
      const fetchedTransactions = respData.transactions.map(
        (transaction) => {
          const currentTransaction = {
            ...transaction,
          };
          return currentTransaction;
        },
      );
      setTransactions(fetchedTransactions);
      
      const filtered = fetchedTransactions.filter((transaction) => (!transaction.submitted));
      setFilteredTransactions(filtered);

    } catch (error) {
      setErrorMessage(respData.error);
      console.log(error);
    } finally {
      console.log("load complete");
    }
  };

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
    } catch (error) {
      console.log(error);
      setErrorMessage(respData.error);
    }

    loadTransactions();
    getUserInfo()
  };

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
    } catch (error) {
      console.log(error);
      setErrorMessage(respData.error);
    } finally {
      console.log("delete complete");
    }

    loadTransactions();
    getUserInfo();
  };

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
      setIsLoading(true);
      getUserInfo();
      loadTransactions();
      setIsLoading(false);
    }, []);

  const handleEdit = (transaction) => {
    setEditedTransaction(transaction);
    setIsEditing(true);
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Faux Financial</h1>
      <h3>
        Welcome {username}. Your balance is ${balance}
      </h3>
      <a onClick={() => handleLogout()}>Logout</a>
      <p>{errorMessage}</p>
      <TransactionForm submitTransaction={addTransaction}>Add</TransactionForm>
      {isEditing && (
        <TransactionForm
          typeOf={editedTransaction.typeOf}
          amount={editedTransaction.amount}
          recipient={editedTransaction.recipientEmail}
          transaction={editedTransaction}
          submitTransaction={editTransaction}
        >Edit</TransactionForm>
      )}
      <table>
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
