import Web3 from 'https://cdn.skypack.dev/web3';
import detectEthereumProvider from 'https://cdn.skypack.dev/@metamask/detect-provider';

// ERC20 토큰 ABI (표준 인터페이스)
const erc20ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "type": "function"
  }
];

const connectButton = document.getElementById('connect');
const accountElement = document.getElementById('account');
const balanceElement = document.getElementById('balance');
const tokenAddressInput = document.getElementById('tokenAddress');
const getTokenBalanceButton = document.getElementById('getTokenBalance');
const tokenBalanceElement = document.getElementById('tokenBalance');

let web3;
let userAccount;

async function connectMetamask() {
  const provider = await detectEthereumProvider();

  if (!provider) {
    console.error('Metamask를 찾을 수 없습니다. 브라우저에서 Metamask를 설치해주세요.');
    return;
  }

  web3 = new Web3(provider);

  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  userAccount = accounts[0];

  if (!userAccount) {
    console.error('이더리움 계정을 찾을 수 없습니다. Metamask에서 계정을 확인해주세요.');
    return;
  }

  const balanceInWei = await web3.eth.getBalance(userAccount);
  const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');

  accountElement.textContent = `계정 주소: ${userAccount}`;
  balanceElement.textContent = `잔액: ${balanceInEther} ETH`;
}

async function getERC20TokenBalance() {
  if (!web3 || !userAccount) {
    console.error('Metamask 연결이 필요합니다. 먼저 Metamask를 연결해주세요.');
    return;
  }

  const tokenAddress = tokenAddressInput.value;

  if (!web3.utils.isAddress(tokenAddress)) {
    console.error('올바른 토큰 컨트랙트 주소를 입력해주세요.');
    return;
  }

  const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);

  try {
    const tokenBalance = await tokenContract.methods.balanceOf(userAccount).call();
    const decimals = await tokenContract.methods.decimals().call();
    const tokenBalanceFormatted = tokenBalance / (10 ** decimals);

    tokenBalanceElement.textContent = `토큰 잔액: ${tokenBalanceFormatted}`;
  } catch (error) {
    console.error('토큰 잔액 조회 중 에러 발생:', error);
  }
}

connectButton.addEventListener('click', connectMetamask);
getTokenBalanceButton.addEventListener('click', getERC20TokenBalance);