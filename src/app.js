App = {
    // Empty object in js.
    contracts: {},
    loading: false,
    
    load: async () => {
        // Aysncy await pattern for loading data from blockchain.
        // Load app..
        //console.log("App loading")
        // await loadWeb3 lets us connect to the blockchain.
        // Connect browser to blockchain with mask
        // Client side app needs to connect to blockchain with Web3JS
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },
      // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

      loadAccount: async () => {
          // eth object contains all accounts.
          App.account = web3.eth.accounts[0]
      },

      loadContract: async () => {
            const mindMap = await $.getJSON('MindMap.json')
            App.contracts.MindMap = TruffleContract(mindMap)
            App.contracts.MindMap.setProvider(App.web3Provider)
            // Hydrate the smart contract with values from the blockchain
            App.mindMap = await App.contracts.MindMap.deployed()
        },
    // Render is an async function.
      render: async () => {
          if (App.loading){
              return
          }
        // Udate app loading state
            App.setLoading(true)
        // Render Account
            $('#account').html(App.account)
        // Render Neurons
            await App.renderNeurons()
            // Update loading state
            App.setLoading(false)
      },
      // Create a neuron
      createNeuron: async () => {
        App.setLoading(true)
        const content = $('#newNeuron').val()
        await App.mindMap.createNeuron(content)
        // Just reloads the page.
        window.location.reload()
      },
      // Given true or false
      setLoading: (boolean) => {
          // Set loading status to the true/false state
          App.loading = boolean
          const loader = $('#loader')
          const content = $('#content')
        // If true meaning loading, show the loader.
          if (boolean) {
              loader.show()
              content.hide()
        // Else if not loading, show the content.
          } else {
              loader.hide()
              content.show()
          }
      },
    // Rendering the neurons to the screen.
    renderNeurons: async () => {
        // Load the total neuron count from the blockchain.
        const neuronCount = await App.mindMap.neuronCount()
        // Connect to HTML layout for neuron template
        const $neuronTemplate = $('.neuronTemplate')

        // Render out each neuron on the page.
        for (var i = 1; i <= neuronCount; i++)
        {
            //Start with one since first valid ID
            // Returns an array of items.
            const neuron = await App.mindMap.neurons(i)
            // uint id number.
            const neuronId = neuron[0].toNumber()
            // string of the content.
            const neuronContent = neuron[1]

            // Creat a new neuron template object in html.
            const $newNeuronTemplate = $neuronTemplate.clone()
            $newNeuronTemplate.find('.content').html(neuronContent)
            // Wiring a new object for the html to look at.
            $newNeuronTemplate.find('input')
                             .prop('name', neuronId)
            // Show the neuron
            $('#neuronList').append($newNeuronTemplate)
            $newNeuronTemplate.show()
        }
    }
}

 $(() => {
     $(window).load(() => {
         App.load()
    })
 })
