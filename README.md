# CTD Lion Final Project: Faux Financial #

This web application is a mock banking app that shows balance information and allows users to create, read, edit, delete, and submit transactions to change their account balance.

## Technologies Used: ##

This web application was created with React (Vite) and Node.js (Express) and it makes use of an online MongoDB cluster for persistent storage of Transaction and User models. Languages used include HTML, CSS, JavaScript, and JSX.

## How to Install and Run: ##

To install, clone this repository to your local machine. From the root directory of the project, enter ```npm install``` into the terminal. To run the application, enter ```npm run dev``` into the terminal.

## How to Run in Deployment ##

From the root directory of the project, enter ```npm install```, then ```npm run build```. To run the app, enter ```npm run start```

## MongoDB Connection and .env File Requirements: ##

This project requires an online MongoDB cluster for persistent storage.

To connect the MongoDB cluster to the project, log into MongoDB.com, and create a new cluster (ensuring that you have a database user already set up). From this cluster, press the "Connect" button, select "Drivers", and pick "Node.js" and "Version 3.6 or later". Don't forget to copy the SRV connection string  Inside the project, the following information is required in a .env file created in the server directory:
* MONGO_URI: This is the SRV that you copied to your clipboard, but with the <db_password> replaced with the password for the corresponding database user, and with the name of the database entered between the ```/``` and the ```?``` in the url.
* JWT_SECRET: This can be any string, but it is ideal to generate a JWT secret key using an online generator.
* JWT_LIFETIME: This is the lifetime of the JWT token, and it will determine how long a user may stay logged in before needing to log in again. "15d" is recommended to allow for a login period of 15 days, but any period of time is permissible.

That should be all you need to start using Airtable for persistent storage.

## How To Use: ##

The Login page is the default page for new users, and it is accessible from the ```/login``` route, or from the ```/``` route for those who are not logged in. Existing users may log in via this page to access the dashboard.

The Register page is accessible from the Login page or by accessing the ```/register``` route. New users may register an account to access the dashboard, and existing users may navigate back to the Login page using the provided link.

The Dashboard page is the default page for logged-in users, and it is accessible from the ```/``` route. The dashboard will display the user's name, balance, and pending transactions. Using the provided form, users may add new transactions to their list of pending transactions:
* Transaction Type: The user may enter "deposit", "withdrawal", or "transfer" as valid transaction types.
* Amount: The user may enter any positive number to set the amount of money, in dollars, that the transaction may apply to the user's account.
* Recipient Email: This field is only applicable for transfers. The user may enter the email of another existing user whom they want to transfer money to.

Clicking ```Add``` will create a new pending transaction according to the values entered in the form.

Transactions will appear in the table below, and each transaction has 3 interactive options:
* ```Edit``` opens a form underneath the add form. The user may change the values in this form and select the ```Edit``` button to close the form and update the existing transaction with new information.
* ```Delete``` removes the transaction from the list of pending transactions.
* ```Submit``` applys the transaction to the user's account. A deposit will add the amount specified. A withdrawal will remove the amount specified. A transfer will remove the amount specified from the user's account and add the same amount to the other user who's email was specified in the "Recipient Email" field.

A logged-in user may log out from the Dashboard by selecting the "Logout" link.

Any attempt to deposit/withdraw/transfer negative numbers will fail.

Any attempt to overdraft (withdraw/transfer more than the user's current) balance will fail.

