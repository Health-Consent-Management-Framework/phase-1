# Report Dash - Health Report Consent Management

## Introduction
Report Dash is a cutting-edge platform designed to streamline healthcare report consent management. 
Our application empowers patients to securely share their medical records with designated healthcare providers, 
ensuring efficient and controlled access to vital information. By facilitating seamless communication between 
patients and doctors, Report Dash enhances the healthcare experience, prioritizing privacy, security, and data 
integrity. This README provides an overview of the project structure, setup instructions, and a description 
of its functionalities.

## Application Setup
### Prerequisites
- Node.js and npm installed
- Truffle framework installed (`npm install -g truffle`)
- Metamask extension installed in your browser

### Installation
1. Clone the repository:
   ``git clone https://github.com/your-username/report-dash.git``
2. Navigate to the project directory: ``cd report-dash``
3. Install Treuffle related dependencies: ``npm install``
4. Install Client related dependencies: ``cd client && npm install``
5. Compile contracts:``truffle compile``

### Local Environment Setup
1. Download Ganache from ``https://archive.trufflesuite.com/ganache/``
2. Start the ganache UI or CLI and Create a new workspace
3. Link the project to ganache by importing the truffle-config.js into ganache
4. Make sure that RPC server is running at ``HTTP://127.0.0.1:7545``
5. Migrate the contract to the ganache network with ``truffle migrate`` inside project directory

### connection the wallet to Metamask
1. To connect the ganache wallets to metamask add the ganache network manually by entering ``RPC URL`` and ``netwoek_id`` <br/> for more info : [click here](https://dapp-world.com/smartbook/how-to-connect-ganache-with-metamask-and-deploy-smart-contracts-on-remix-without-1619847868947)
2. Import the ganache wallet with the help of private key. for more info: [click here](https://docs.cranq.io/web-3/setting-up-ganache-with-metamask)
3. connect to the website by click on the active sites icon. <br/>  <br/> ![image](https://github.com/Health-Consent-Management-Framework/phase-1/assets/82657104/34dd837e-c0d8-4f65-ad46-91dfe36fcba0)

## Application Description
Report Dash is a decentralized application (DApp) built using Truffle for smart contract development and React for the frontend. 
It facilitates the management of health report consent, allowing users to securely share their health data with authorized entities.

### User Types
1. **Admin:** 
- Sign up with a super key for automatic verification.
- Has full access and control over the application's functionalities.

2. **Worker and Doctor:**
- Require verification by a verified admin or verified worker.
- Upon verification, gain access to specific features based on their roles.

3. **Patient:**
- Can sign up and upload their own medical reports.
- Reports uploaded by verified workers and verified admins are automatically granted verified status.
- Reports uploaded by patients, doctors, or other non-verified users require verification by an admin or worker.

4. **Doctor**
- Should request verification after signup
- Until verified, they have limited access similar to patients.
  
5. **Non-Verified Users (except patients):**
- Must request verification to access advanced features.

## Contributors
- [P Vivek Yadav](https://github.com/VivekYadav05)
- [K Anil Kumar Reddy](https://github.com/anilkoduru)
- [M RajeshNaidu](https://github.com/RajeshNaidu1)
- [Vegi Anand Suhhas](https://github.com/suhaas02)

