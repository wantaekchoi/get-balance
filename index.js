import Web3 from "https://cdn.skypack.dev/web3";
import detectEthereumProvider from "https://cdn.skypack.dev/@metamask/detect-provider";

const erc20ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    type: "function",
  },
];

/** Apr 18, 2023 */
const topEthereumErc20InEtherscan = [
  {
    name: "Tether USD",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    name: "BNB",
    address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  },
  {
    name: "USD Coin",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  {
    name: "stETH",
    address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
  },
  {
    name: "HEX",
    address: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
  },
  {
    name: "Matic Token",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
  },
  {
    name: "ANY Litecoin",
    address: "0x0abcfbfa8e3fda8b7fba18721caf7d5cf55cf5f5",
  },
  {
    name: "SHIBA INU",
    address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  },
  {
    name: "Binance USD",
    address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
  },
  {
    name: "Theta Token",
    address: "0x3883f5e181fccaf8410fa61e12b59bad963fb645",
  },
  {
    name: "Dai Stablecoin",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  {
    name: "Uniswap",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  },
  {
    name: "Wrapped BTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  },
  {
    name: "ChainLink Token",
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
  },
  {
    name: "Wrapped TON Coin",
    address: "0x582d872a1b094fc48f5de31d3b73f2d9be47def1",
  },
  {
    name: "OKB",
    address: "0x75231f58b43240c9718dd58b4967c5114342a86c",
  },
  {
    name: "Bitfinex LEO Token",
    address: "0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3",
  },
  {
    name: "Lido DAO Token",
    address: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
  },
  {
    name: "Arbitrum",
    address: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1",
  },
  {
    name: "NEAR",
    address: "0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4",
  },
];

const connectButton = document.getElementById("connectButton");
const accountElement = document.getElementById("accountElement");
const balanceElement = document.getElementById("balanceElement");
const erc20AddressInput = document.getElementById("erc20AddressInput");
const addErc20BalanceButton = document.getElementById("addErc20BalanceButton");
const erc20TableBody = document.getElementById("erc20TableBody");

let provider;
let web3;

async function getAccount(index = 0) {
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  return accounts[index] ?? null;
}

async function getEthereumBalance(account) {
  if (!web3) {
    console.error("Errro");
    return;
  }

  const balanceInWei = await web3.eth.getBalance(account);
  const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");

  return balanceInEther;
}

async function connectMetamask() {
  provider = await detectEthereumProvider();
  if (!provider) {
    console.error(
      "Metamask를 찾을 수 없습니다. 브라우저에서 Metamask를 설치해주세요."
    );
    return;
  }

  web3 = new Web3(provider);
}

async function getERC20TokenBalance(account, erc20Address) {
  if (!web3 || !account) {
    console.error("Metamask 연결이 필요합니다. 먼저 Metamask를 연결해주세요.");
    return;
  }

  if (!web3.utils.isAddress(erc20Address)) {
    console.error("올바른 ERC20 컨트랙트 주소를 입력해주세요.");
    return;
  }

  const tokenContract = new web3.eth.Contract(erc20ABI, erc20Address);

  try {
    const name = await tokenContract.methods.name().call();
    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
    const decimals = await tokenContract.methods.decimals().call();
    const tokenBalanceFormatted = tokenBalance / 10 ** decimals;

    return { name, tokenBalanceFormatted };
  } catch (error) {
    console.error(`ERC20(${erc20Address}) 잔액 조회 중 에러 발생:`, error);
  }
}

async function onClickConnectButton() {
  await connectMetamask();

  const account = await getAccount();
  if (!account) {
    console.error(
      "이더리움 계정을 찾을 수 없습니다. Metamask에서 계정을 확인해주세요."
    );
    return;
  }
  accountElement.textContent = `계정: ${account}`;

  const balanceInEther = await getEthereumBalance(account);
  balanceElement.textContent = `잔액: ${balanceInEther} ETH`;

  topEthereumErc20InEtherscan.forEach(({ address }) =>
    getERC20TokenBalance(account, address).then(
      ({ name, tokenBalanceFormatted: balance }) =>
        addErc20TableRow(name, address, balance)
    )
  );
}

function getErc20AddressInputValue() {
  return erc20AddressInput.value;
}

function addErc20TableRow(name, address, balance) {
  const newRow = erc20TableBody.insertRow();
  const nameCell = newRow.insertCell();
  const addressCell = newRow.insertCell();
  const balanceCell = newRow.insertCell();

  nameCell.textContent = name;
  addressCell.textContent = address;
  balanceCell.textContent = `${balance}`;
}

async function onClickAddErc20BalanceButton() {
  const account = await getAccount();
  if (!account) {
    console.error(
      "이더리움 계정을 찾을 수 없습니다. Metamask에서 계정을 확인해주세요."
    );
    return;
  }

  const erc20Address = getErc20AddressInputValue();
  if (!erc20Address) {
    console.error("ERC20 컨트렉트 주소를 입력해주세요");
    return;
  }

  const { name: erc20Name, tokenBalanceFormatted: erc20Balance } =
    await getERC20TokenBalance(account, erc20Address);

  addErc20TableRow(erc20Name, erc20Address, erc20Balance);
}

connectButton.addEventListener("click", onClickConnectButton);
addErc20BalanceButton.addEventListener("click", onClickAddErc20BalanceButton);
