import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";

import { userRequest } from "../../../requestmethod";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;

  useEffect(() => {
    const getHistory = async () => {
      const res = await userRequest.get("/user/history");
      setHistory(res.data);
    };
    getHistory();
  }, [setHistory]);

  return (
    <div className="history-page">
      <h2>History</h2>

      <h4>You have {history.length} ordered</h4>

      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date of Purchased</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {history.map((items) => (
            <tr key={items._id}>
              <td>{items.paymentID}</td>
              <td>{new Date(items.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/history/${items._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
