import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [ethSpent, setEthSpent] = useState(0);
  const [myTickets, setMyTickets] = useState(0);
  const [tickets, setTickets] = useState("");
  const [ticketsToWithdraw, setTicketsToWithdraw] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      setAccount(account[0]);
    } else {
      console.log("No account detected");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("A MetaMask wallet is necessary to connect.");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalanceAndTickets = async () => {
    if (atm) {
      try {
        const ethSpentInWei = await atm.getETHSpent();
        const tickets = await atm.getMyTickets();
        setEthSpent(ethers.utils.formatEther(ethSpentInWei));
        setMyTickets(tickets.toString());
      } catch (error) {
        console.error("Error getting balance and tickets:", error);
      }
    }
  };

  const purchaseTickets = async () => {
    const numTickets = Number(tickets);

    if (numTickets <= 0) {
      alert("Please enter a valid number of tickets.");
      return;
    }

    const costPerTicket = numTickets > 1 ? 2 : 3;
    const totalCost = ethers.utils.parseEther((numTickets * costPerTicket).toString());

    if (atm) {
      try {
        let tx = await atm.purchaseTickets(numTickets, { value: totalCost });
        await tx.wait();
        await getBalanceAndTickets();
      } catch (error) {
        console.error("Error purchasing tickets:", error);
      }
    }
  };

  const withdrawTickets = async () => {
    const numTicketsToWithdraw = Number(ticketsToWithdraw);

    if (numTicketsToWithdraw <= 0 || numTicketsToWithdraw > myTickets) {
      alert("Please enter a valid number of tickets to withdraw.");
      return;
    }

    if (atm) {
      try {
        let tx = await atm.withdraw(numTicketsToWithdraw);
        await tx.wait();
        await getBalanceAndTickets();
      } catch (error) {
        console.error("Error withdrawing tickets:", error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>To purchase tickets, please install Metamask</p>;
    }

    if (!account) {
      return (
        <button className="connect-button" onClick={connectAccount}>
          Please connect Your Metamask Wallet
        </button>
      );
    }

    if (ethSpent === undefined || myTickets === undefined) {
      getBalanceAndTickets();
    }

    return (
      <div className="atm">
        <div className="main-content">
          <div className="balance-section">
            <div className="balance-block">
              <div className="balance-icon">
                <i className="fas fa-ethereum"></i>
              </div>
              <div className="balance-details">
                <p className="balance-title">Total ETH Spent</p>
                <p className="balance-info">{ethSpent} ETH</p>
              </div>
            </div>
            <div className="balance-block">
              <div className="balance-icon">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="balance-details">
                <p className="balance-title">Tickets Owned</p>
                <p className="balance-info">{myTickets} Ticket(s)</p>
              </div>
            </div>
          </div>

          {/* Purchase Tickets Section */}
          <div className="purchase-box">
            <h2 className="transaction-title">Purchase Tickets</h2>
            <form className="amount-form">
              <label>
                Number of tickets:
                <input
                  type="number"
                  min="1"
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                />
              </label>
            </form>
            <button className="purchase-button" onClick={purchaseTickets}>
              Purchase {tickets} Ticket(s)
            </button>
          </div>

          {/* Withdraw Tickets Section */}
          <div className="withdraw-box">
            <h2 className="transaction-title">Withdraw Tickets</h2>
            <form className="amount-form">
              <label>
                Number of tickets to withdraw:
                <input
                  type="number"
                  min="1"
                  value={ticketsToWithdraw}
                  onChange={(e) => setTicketsToWithdraw(e.target.value)}
                />
              </label>
            </form>
            <button className="withdraw-button" onClick={withdrawTickets}>
              Withdraw {ticketsToWithdraw} Ticket(s)
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>ETH Olympic Ticket Purchase</h1>
      </header>
      {initUser()}
      <style jsx>{`
        body {
          background-color: #f4f4f9;
          color: #333;
          margin: 0;
          font-family: 'Arial', sans-serif;
        }
        .container {
          text-align: center;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin: 40px auto;
          width: 90%;
          max-width: 1000px;
          background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzfTb962LHXdIfWcgz0TrDVyoXYmjGiaGxEg&s') no-repeat center center;
          background-size: cover;
          background-blur: 10px;
        }
        header h1 {
          font-size: 2.5em;
          margin-bottom: 30px;
          color: #fff;
          font-weight: bold;
          text-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
        }
        .atm {
          padding: 30px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }
        .balance-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .balance-block {
          display: flex;
          align-items: center;
          background: #eaf4f4;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 80%;
          max-width: 600px;
          margin-bottom: 20px;
        }
        .balance-icon {
          font-size: 2em;
          color: #1abc9c;
          margin-right: 20px;
        }
        .balance-details {
          color: #333;
        }
        .balance-title {
          font-size: 1.4em;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .balance-info {
          font-size: 1.2em;
        }
        .transaction-title {
          font-size: 1.6em;
          margin-bottom: 20px;
          font-weight: bold;
          color: #2c3e50;
        }
        .amount-form {
          margin: 15px 0;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .amount-form input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #dcdde1;
          font-size: 1em;
        }
        .purchase-button {
          padding: 12px 28px;
          background-color: #27ae60;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2em;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .purchase-button:hover {
          background-color: #2ecc71;
        }
        .connect-button,
        .withdraw-button {
          padding: 12px 28px;
          background-color: #3498db; 
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2em;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .withdraw-button:hover,
        .connect-button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </main>
  );
}
