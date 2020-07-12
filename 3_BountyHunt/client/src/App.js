
// When importing from React library, you must import React like so ~ import React from 'react' ~ Because React is a default export. 
// Component is put in curly braces because it is an optional import. And therefore optional imports from the library are put in braces. 

import React, { Component } from "react";

// import the App.css file in our application

import "./App.css";

// import the BountiesContract and Web3

import BountiesContract from "./contracts/Bounties.json";
import getWeb3 from "./utils/getWeb3";

// The table is using two react-bootstrap-table components so we'll need to import those and also import the react-boostrap-table css.

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

// There are basically two ways of writing components in React: functional and class components. 
// A functional component is just a plain JavaScript function which accepts props as an argument and returns a React element.

// A functional component doesn’t have its own state nor use of hooks. 
  // If you need a state in your component you will either need to create a class component or you lift the state up to the parent component and pass it down the functional component via props.
  // Another feature which you cannot use in functional components are lifecycle hooks. 
  // The reason is the same as for state, all lifecycle hooks are coming from the React.Component which you extend from in class components. 
  // So if you need lifecycle hooks you should probably use a class component.

// A class component requires you to extend from React.Component and create a render function which returns a React element.
  // Pros of using a class componet like below (as opposed to functional) is use of state and hooks. 

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      bountiesInstance: undefined,
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

  // componentDidMount()` is a react lifecycle method which is called just after the component is mounted  we use this react lifecycle event to initiate our web3 instance 
    // by calling `getWeb3` and also instantiating our contract instance object. This ensures our contract instance and web3 objects are ready for when our application renders.

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      
      const networkId = await web3.eth.net.getId();
      
      const deployedNetwork = BountiesContract.networks[networkId];
      
      const instance = new web3.eth.Contract(
       BountiesContract.abi,
       deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ bountiesInstance: instance, web3: web3, account: accounts[0]})
      this.addEventListener(this)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  // To subscribe to events we'll add a new function to App.js named addEventListener
    // Setting up a web3.js events object which will subscribe BountyIssued events from block 0 (the beginning of blockchain) to the latest
    // Next, we use the .on callback which we'll use to process each event we receive
    // When we receive an event we simply copy the current bounties array and push the event args into it and set that as our new bounties state.

  addEventListener(component) {

    this.state.bountiesInstance.events.BountyIssued({fromBlock: 0, toBlock: 'latest'})
    .on('data', function(event){ //'data' is part of the syntax.
      console.log(event); // same results as the optional callback above returnValues: Object {} 
      var newBountiesArray = component.state.bounties
      newBountiesArray.push(event.returnValues)
      component.setState({ bounties: newBountiesArray })
    })
    .on('error', console.error);
  }

  // Handle form data change

  handleChange(event)
  {
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

  // Handle form submit

    // We add the issueBounty callback to handle the event which happens when the user submits the form. 
    // This function takes the current form input values from the component state, and use the bountiesInstance object to construct and 
    // send an issueBounty transaction with the form inputs as arguments.

  async handleIssueBounty(event)
  {
    if (typeof this.state.bountiesInstance !== 'undefined') {
      event.preventDefault();
      await this.state.bountiesInstance.methods.issueBounty(this.state.bountyData,this.state.bountyDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.bountyAmount, 'ether')})
    }
  }

  render() {

    // Successful Loading screen.

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    // App

    return (

      <div className="App">
      
      <br/>

      <Grid>

      <Row>
      <Panel>
          <Panel.Heading>Issue Bounty</Panel.Heading>

        {/* This line will call async handleIssueBounty(event) on line 133*/}


      <Form onSubmit={this.handleIssueBounty}>
          <FormGroup controlId="fromCreateBounty">

            <FormControl
              componentClass="textarea"
              name="bountyData"
              value={this.state.bountyData}
              placeholder="Enter bounty details"
              onChange={this.handleChange}
            />

            <HelpBlock>Enter bounty data</HelpBlock><br/>

            <FormControl
              type="text"
              name="bountyDeadline"
              value={this.state.bountyDeadline}
              placeholder="Enter bounty deadline"
              onChange={this.handleChange}
            />

            <HelpBlock>Enter bounty deadline in seconds since epoch</HelpBlock><br/>

            <FormControl
              type="text"
              name="bountyAmount"
              value={this.state.bountyAmount}
              placeholder="Enter bounty amount"
              onChange={this.handleChange}
            />

            <HelpBlock>Enter bounty amount</HelpBlock><br/>

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
        <TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
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
