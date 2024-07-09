import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import { removeLiquidity, loadBalances } from "../store/interactions";

import Alert from "./Alert";

export const Withdraw = () => {
  const [amount, setAmount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const dispatch = useDispatch();

  const provider = useSelector((state) => state.provider.connection);
  const account = useSelector((state) => state.provider.account);
  const tokens = useSelector((state) => state.tokens.contracts);
  const balances = useSelector((state) => state.tokens.balances);
  const amm = useSelector((state) => state.amm.contract);
  const shares = useSelector((state) => state.amm.shares);
  const isWithdrawing = useSelector(
    (state) => state.amm.withdrawing.isWithdrawing
  );
  const isSuccess = useSelector((state) => state.amm.withdrawing.isSuccess);
  const transactionHash = useSelector(
    (state) => state.amm.withdrawing.transactionHash
  );

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setShowAlert(false);
    const _shares = ethers.utils.parseUnits(amount.toString(), "ether");
    await removeLiquidity(provider, amm, _shares, dispatch);
    await loadBalances(amm, tokens, account, dispatch);
    setShowAlert(true);
    setAmount(0);
  };

  return (
    <div>
      <Card
        style={{ maxWidth: "450px", height: "394px" }}
        className="mx-auto px-4 bg-dark border-danger"
      >
        {account ? (
          <Form
            onSubmit={handleWithdraw}
            style={{ maxWidth: "450px", margin: "50px auto" }}
          >
            <Row className="my-3">
              <Form.Text className="text-end my-2 text-light">
                Shares: {shares}
              </Form.Text>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="0"
                  min="0.0"
                  step="any"
                  id="shares"
                  value={amount === 0 ? "" : amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-danger"
                />
                <InputGroup.Text
                  style={{ width: "100px" }}
                  className="justify-content-center border-danger text-light bg-dark"
                >
                  Shares
                </InputGroup.Text>
              </InputGroup>
            </Row>
            <Row>
              {isWithdrawing ? (
                <Spinner
                  animation="border"
                  style={{ display: "block", margin: "0 auto", color: "red" }}
                />
              ) : (
                <Button
                  type="submit"
                  className="bg-danger border-danger"
                  style={{ marginTop: "8px" }}
                >
                  Withdraw
                </Button>
              )}
            </Row>
            <hr />
            <Row>
              <p>
                <strong>RUMP Balance: </strong>
                {balances[0]}
              </p>
              <p>
                <strong>USD Balance: </strong>
                {balances[1]}
              </p>
            </Row>
          </Form>
        ) : (
          <p
            className="d-flex justify-content-center align-items-center"
            style={{ height: "300px" }}
          >
            Please connect wallet
          </p>
        )}
      </Card>
      {isWithdrawing ? (
        <Alert
          message={"Withdraw Pending..."}
          transactionHash={null}
          variant={"info"}
          setShowAlert={setShowAlert}
        />
      ) : isSuccess && showAlert ? (
        <Alert
          message={"Withdraw Successful"}
          transactionHash={transactionHash}
          variant={"success"}
          setShowAlert={setShowAlert}
        />
      ) : !isSuccess && showAlert ? (
        <Alert
          message={"Withdraw Failed"}
          transactionHash={null}
          variant={"danger"}
          setShowAlert={setShowAlert}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Withdraw;
