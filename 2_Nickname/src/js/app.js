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

      instance.update({}, {
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
    var output = $("#output");

    var dappInstance;

    App.loading = true;

    loader.show();
    output.hide();
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
      dappInstance = instance;

    // Return the "ReturnNickname"
    
    return dappInstance.ReturnNickname();
    }).then(function(ReturnNickname) {
    App.ReturnNickname = ReturnNickname;
    $('.Nickname').html(App.ReturnNickname);

    // Return the "Returnuser"
    
    return dappInstance.Returnuser();
    }).then(function(Returnuser) {
    App.Returnuser = Returnuser.toNumber();
    $('.user').html(App.Returnuser);

    // Shows the output if its a user.

    if (App.Returnuser > 0) {
        output.show();
    }

    // Return the "Returnedit"
    
    return dappInstance.Returnedit();
    }).then(function(Returnedit) {
    App.Returnedit = Returnedit.toNumber();
    $('.edit').html(App.Returnedit);

    // Hide Loader & Processing, and Show content 
      
    App.loading = false;
    loader.hide();
    processing.hide();
    content.show();
    })

  },

  setnicknamebutton: function() {
    $("#content").hide();
    $("#processing").show();
    var newnickname = $('#newnickname').val();
    
    App.contracts.Dapp.deployed().then(function(instance) {
      
      return instance.SetNickname(newnickname);
    }).then(function(result) {
      $('form').trigger('reset') // reset form
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
