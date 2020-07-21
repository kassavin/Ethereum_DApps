// Assign Contract Name & declare Location.
import ERC721Token from './contracts/ERC721Token.json';

// List the Contract Names.
const options = { contracts: [ERC721Token],  events: { ERC721Token: ['Transfer', 'Approval'] } };

export default options;
