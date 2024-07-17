import { useSelector, useDispatch } from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Blockies from "react-blockies";

import logo from "../logo.jpg";

import { loadAccount, loadBalances } from "../store/interactions";
import sepoliaData from "../sepoliaConfig.json";
import localhostData from "../localhostConfig.json";

const Navigation = () => {
  const chainId = useSelector((state) => state.provider.chainId);
  const account = useSelector((state) => state.provider.account);
  const tokens = useSelector((state) => state.tokens.contracts);
  const amm = useSelector((state) => state.amm.contract);
  const dispatch = useDispatch();
  const config = chainId === 11155111 ? sepoliaData : localhostData;

  const handleConnect = async () => {
    const account = await loadAccount(dispatch);
    await loadBalances(amm, tokens, account, dispatch);
  };

  const handleNetwork = async (e) => {
    console.log(e.target.value, chainId);
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: e.target.value }],
    });
  };

  return (
    <>
      <Navbar className="my-3 bg-dark" expand="lg">
        <img
          alt="logo"
          src={logo}
          width="50"
          height="50"
          style={{ borderRadius: '100%'}}
          className="d-inline-block align-top mx-3"
        />
        <Navbar.Brand className="text-danger fw-bold" href="#">
          Blood Moon Swap
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav" className="justify-content-end">
          <div className="d-flex justify-content-end mt-3 bg-dark border-danger">
            <Form.Select
            className="bg-danger border-danger text-light"
              aria-label="Network Selector"
              value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
              onChange={handleNetwork}
              style={{ maxWidth: "200px", marginRight: "20px" }}
            >
              <option value="0" disabled>
                Select Network
              </option>
              <option value="0x7A69">Localhost</option>
              <option value="0xaa36a7">Sepolia</option>
            </Form.Select>

            {account ? (
              <Navbar.Text className="d-flex align-items-center text-danger">
                {account.slice(0, 5) + "..." + account.slice(38, 42)}
                <Blockies
                  seed={account}
                  size={10}
                  scale={3}
                  color="black"
                  bgColor="red"
                  spotColor="orange"
                  className="identicon mx-2"
                />
              </Navbar.Text>
            ) : (
              <Button
                className="bg-danger border-danger text-dark"
                onClick={handleConnect}
              >
                Connect
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Navigation;
