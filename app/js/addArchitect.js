function populateArchitectAccounts() {
    var archSelect = $("#architectAccount");
}

// TODO: Some sort of serious logging
function onError(err) {
    alert("Quick, Call batman! We have a: " + err);
}
function addArchitectAccount(palladioAccount, architectAccount) {

    CBDContractFactory.methods.getPalladioAddress().call().then(function(addr) {
        // First, validate this 
        if (addr != palladioAccount)
        {
            alert("ERROR: Palladio account does not match contract account (" + palladioAccount + " != " + addr);
            return undefined;      
        }
        $("#outputDiv").html("Architect adding now: (awaiting confirmation - please wait...)");        
        return CBDContractFactory.methods.registerArchitect(architectAccount).send({'from':palladioAccount});
    }, onError).then(function(result) {
        $("#onAddArchitectBtn")[0].disabled = false
        // Should we validate this?
        return CBDContractFactory.methods.numArchitects().call();
    }, onError).then(function(value) {
        $("#outputDiv").html("Architect Added: There are " + value + " architects registered");
    }, onError);
}

function onAddArchitect() {

    var palladioAccount = getSelectedAccount("#palladioAccount")
    var architectAccount = $("#architectAccount").val(); 

    if (!validateAccount(palladioAccount))
        return
        
    if (!validateAccount(architectAccount))
        return
    
    $('#onAddArchitectBtn')[0].disabled = true
    addArchitectAccount(palladioAccount, architectAccount);
}

//-------------------------------------------------------------------

function setTokenAddress(tokenAddress) {

    $("#tokenOutputDiv").html("Set Token Contract address: (awaiting confirmation - please wait...)");        
    CBDContractFactory.methods.setTokenContract(tokenAddress).send({"from":web3.eth.defaultAccount})
    .then(function(addr) {
        $("#onAddArchitectBtn")[0].disabled = false
        updateCurrentTokenAddress()
    }, onError);
}
function onSetTokenAddress() {

    var tokenAddress = $("#tokenAddress").val(); 

    if (!validateAccount(tokenAddress))
        return
        
    $('#onSetTokenBtn')[0].disabled = true
    setTokenAddress(tokenAddress);
}

function updateCurrentTokenAddress() {
    CBDContractFactory.methods.getTokenAddress().call()
    .then(function(res)
    {
        $("#tokenOutputDiv").html("Current Token Address: " + res);    
    }, onError)
}

populateSelectWithAccounts("#palladioAccount")

__loadManagerInstance.execWhenReady(function() {
    CBDContractFactory.methods.numArchitects().call()
    .then(function(value){
        $("#outputDiv").html("There are " + value + " architects registered");
    }, onError)

    $("#tokenAddress").val(SampleToken.options.address); 
    updateCurrentTokenAddress()
})
