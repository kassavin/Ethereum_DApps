import React, { Component } from "react";
import "./App.css";

import DAppContract from "./contracts/DApp.json";
import getWeb3 from "./utils/getWeb3";

import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import Button from 'react-bootstrap/lib/Button';

import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Panel from 'react-bootstrap/lib/Panel';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      DAppInstance: undefined,
      bountyAmount: undefined,
      bountyData: undefined,
      bountyDeadline: undefined,
      bounties: [],
      account: null,
      web3: null
    }

    this.handleIssueBounty = this.handleIssueBounty.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();    
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DAppContract.networks[networkId];
      const instance = new web3.eth.Contract(DAppContract.abi, deployedNetwork && deployedNetwork.address);

      this.setState({ DAppInstance: instance, web3: web3, account: accounts[0]})
      this.addEventListener(this)

      } catch (error) { alert(`Please connect to the Rinkeby Test Network.`) }
  };

  addEventListener(component) {

    this.state.DAppInstance.events.BountyIssued({fromBlock: 0, toBlock: 'latest'}).on('data', function(event){ 
      var newBountiesArray = component.state.bounties
      newBountiesArray.push(event.returnValues)
      component.setState({ bounties: newBountiesArray })
    })
  }

  handleChange(event) {

    switch(event.target.name) {
        case "bountyData":
            this.setState({"bountyData": event.target.value})
            break;
        case "bountyDeadline":
            this.setState({"bountyDeadline": event.target.value})
            break;
        case "bountyAmount":
            this.setState({"bountyAmount": event.target.value})
            break;
        default:
            break;
    }
  }

  async handleIssueBounty(event) {
    if (typeof this.state.DAppInstance !== 'undefined') {
      event.preventDefault();
      await this.state.DAppInstance.methods.issueBounty(this.state.bountyData,this.state.bountyDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.bountyAmount, 'ether')})
    }
  }

  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (

      <div className="App">   
      <br/>
      <Grid>

      <Row>
      <Panel>
          <Panel.Heading>Issue Bounty</Panel.Heading>

      <Form onSubmit={this.handleIssueBounty}>
          <FormGroup controlId="fromCreateBounty">

            <FormControl
              required
              componentClass="textarea"
              name="bountyData"
              value={this.state.bountyData}
              placeholder="Enter bounty details"
              onChange={this.handleChange}
            />

            <HelpBlock>Enter bounty data</HelpBlock><br/>

            <FormControl
              required
              type="text"
              name="bountyDeadline"
              value={this.state.bountyDeadline}
              placeholder="Enter bounty deadline (e.g. 1609459200 )"
              onChange={this.handleChange}
            />

            <HelpBlock>Enter bounty deadline in seconds since epoch (Ref: 01/01/2021 is 1609459200 )</HelpBlock><br/>

            <FormControl
              required
              type="text"
              name="bountyAmount"
              value={this.state.bountyAmount}
              placeholder="Enter bounty amount (e.g. 0.05)"
              onChange={this.handleChange}
            />

            <HelpBlock> Enter bounty amount in ether (Ref: 1 wei is 0.000000000000000001 ether)</HelpBlock><br/>

            <Button type="submit">Issue Bounty</Button>

          </FormGroup>
      </Form>

      </Panel>
      </Row>
      
      <Row>
      <Panel>
          <Panel.Heading>Issued Bounties</Panel.Heading>
      
      <BootstrapTable data={this.state.bounties}>

        <TableHeaderColumn isKey dataField='bounty_id'>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='issuer'>Issuer</TableHeaderColumn>
        <TableHeaderColumn dataField='amount'>Amount (wei)</TableHeaderColumn>
        <TableHeaderColumn dataField='data'>Bounty Data</TableHeaderColumn>

      </BootstrapTable>

      </Panel>
      </Row>

      </Grid>
      </div>

    );
  }
}

export default App;