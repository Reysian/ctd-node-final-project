import { useRef, useState } from "react";

function TransactionForm({
  typeOf = "",
  amount = "",
  recipient = "",
  transaction,
  submitTransaction,
  children
}) {
  const typeOfInput = useRef(document.querySelector("#typeOf"));
  const amountInput = useRef(document.querySelector("#amount"));
  const recipientInput = useRef(document.querySelector("#recipient"));

  const [workingTypeOf, setWorkingTypeOf] = useState(typeOf);
  const [workingAmount, setWorkingAmount] = useState(amount);
  const [workingRecipient, setWorkingRecipient] = useState(recipient);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (transaction) {
      submitTransaction(transaction, workingTypeOf, Number(workingAmount), workingRecipient);
    } else {
      submitTransaction(workingTypeOf, Number(workingAmount), workingRecipient);
    }
    
  };

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <label htmlFor="typeOf">Transaction Type:</label>
      <input
        id="typeOf"
        ref={typeOfInput}
        type="text"
        value={workingTypeOf}
        onChange={(event) => setWorkingTypeOf(event.target.value)}
      ></input>
      <label htmlFor="amount">Amount:</label>
      <input
        id="amount"
        ref={amountInput}
        type="text"
        value={workingAmount}
        onChange={(event) => setWorkingAmount(event.target.value)}
      ></input>
      <label htmlFor="recipient">Recipient Email (Transfer Only):</label>
      <input
        id="recipient"
        ref={recipientInput}
        type="text"
        value={workingRecipient}
        onChange={(event) => setWorkingRecipient(event.target.value)}
      ></input>
      <button onSubmit={(event) => handleSubmit(event)}>{children}</button>
    </form>
  );
}

export default TransactionForm;
