App = {

  // Standard Declarations

  contracts: [],
  
  // 'init' function to start 'Web3'

  init: function() {
    return App.initWeb3();
  },
  
  // 'Web3' function to process and start 'init Contracts'. 

  initWeb3: function() {
    
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContracts();

  },

  // 'init Contracts' function to process and start 'listenForEvents' and 'render'

  initContracts: function() {
      $.getJSON("DApp.json", function(dapp) {
        App.contracts.Dapp = TruffleContract(dapp);
        App.contracts.Dapp.setProvider(App.web3Provider);

        App.listenForEvents();
        return App.render();
      });
  
  },

  // 'listenForEvents' function to process and start 'render'


  listenForEvents: function() {

    App.contracts.Dapp.deployed().then(function(instance) {

      instance.Action({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        // Reload when update is received. 
        App.render();
      });
    });
  },

  // 'render' function to process

  render: function() {
    
    if (App.loading) {
      return;
    }
     
    var loader = $("#loader");
    var content = $("#content");
    var processing = $("#processing");

    App.loading = true;

    loader.show();
    processing.hide();
    content.hide();
    

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load the Dapp contract
    
    App.contracts.Dapp.deployed().then(function(instance) {

    // Return the "StoredNumber"
    
    return instance.returnnumber();
    }).then(function(returnnumber) {
    App.returnnumber = returnnumber.toNumber();
    $('.StoredNumber').html(App.returnnumber);

    // Hide Loader & Processing, and Show content 
      
    App.loading = false;
    loader.hide();
    processing.hide();
    content.show();
    })

  },

  setnumberbutton: function() {
    $("#content").hide();
    $("#processing").show();
    var newnumber = $('#newnumber').val();
    
    App.contracts.Dapp.deployed().then(function(instance) {
      
      return instance.setnumber(newnumber);
    }).then(function(result) {
      $('form').trigger('reset') // reset number
      // Wait for events
    }).catch(function(err) {
      console.error(err);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
