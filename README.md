# Lendsqr Demo Credit
Demo Credit is a mobile lending backend system with a wallet functionality, lenders will fund their account(deposit), then create loan, so when a borrower comes to request for a loan, the money will be debited from the lender's account and credited to the borrower's account.

#
## ⚡️ Features
* User registration
* User login
* Ledger for accurate book keeping
* Internal transfer between users
* Withdrawal
* Deposit (Account topup)
* Creating loans (For lenders)
* Accepting loan offers (For borrowers)
* Loan Repayment with interest using formula `amount(interest_per_day / 100) * days)`
* Unit testing


#
## 🔥 Technologies
* Typescript
* Mysql
* KnexORM
* Jest


#
## 🥷 Installation

This repository was written in typescript and runs on Nodejs

1. Make sure you're running Node.js on your system
2. ``git clone https://github.com/SilverC0de/lendsqr-demo-credit.git``
3. ``cd lendsqr-demo-credit``
4. ``npm i``
5. ``npm build``
6. ``npm run it``


#
## ✔️ System guides
* Only lenders are allowed to create loan options with details like *tenure, interest, min and max amount.*
* Lenders need to fund their wallet before borrowers can get loans
* Borrowers will see the loan options before they can choose their preferred loan
* Accepting a loan option is for borrowers, the requested ID is gotten from the list of loan options. The lender's wallet will then be debited and the borrower's wallet will be credited
* Deposits and withdrawals does not require debit cards or bank accounts as this is a demo project
* Loan repayments for borrowers is paid once and the borrower needs to have the repayment amount in their wallet, the ID can be gotten from the list of loans
* Internal transfer is a P2P feature that allows users send money between themselves



#
## 🚀 Testing

1. Download the <a id="raw-url" href="https://raw.githubusercontent.com/SilverC0de/lendsqr-demo-credit/main/postman_collection.json">Postman Collection</a>
2. Open Postman and import the collection
3. Add the variable `baseUrl` with value `https://dshj` to the collection and save
4. Navigate the collection and test the endpoints

#
## 📚 Database Schema
MySQL Database Schema design using InnoDB storage engine. It has foreign keys linking the users and other tables.

* **users**: The `users` table keeps the data of all users (borrowers and lenders)
* **ledger**: The `ledger` is the book keeping system that keeps track of all the debits and credits of each user so it has to be linked to the `users table`
* **loan_options**: The `loan_options` is the table collating loans created by lenders, so it has to be linked to the `users` table for each lender
* **loans**: The `loans` table collates data of loans that have been accepted by borrowers
* **transactions**: The `transactions` table collates data of all types of transactions for every user

![image info](./db.png)