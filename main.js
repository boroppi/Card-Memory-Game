// Step 1a - Select and store the gameboard element
const gameboard = document.querySelector('#gameboard')
// Step 1b - Select and store the score element
const score = document.querySelector('#score')
// Step 1c - Select and store the cards element
const cards = document.querySelector('#cards')
// Step 1d - Select and store the message element
const message = document.querySelector('#message')
message.textContent = "Welcome, Select a difficulty"
//get reset button element
const reset = document.querySelector('#reset')
reset.style.display = "none"
console.log(reset)



difficultySelection()



function StartGame(difficulty) {
  message.textContent = "Select a card to start"
  var cardValues;
  console.log(difficulty)
  switch(difficulty)
  {
    case "easy":
    cardValues = ['A', 2, 3, 4]
    break
    case "medium":
    cardValues = ['A', 2, 3, 4, 5, 6, 7, 8, 9]
    break
    case "hard":
    cardValues = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
    break
  }


  let deck = []

  var isFrozen = false

  // Step 2a - Create a function to shuffle the deck
  function shuffleDeck () {
    // Step 2b - Create a placeholder array
    let tmp = []  

    // Step 2c - Iterate through card values 4 times
    for (let i = 0; i < 4; i++) {
      for(let cardValue of cardValues) {
        tmp.push(cardValue)
      }    
    }
    console.log(tmp)
    var tmpLength = tmp.length
    for(let j = 0; j< tmpLength; j++) {
    // Step 2d - Using a conditional loop
      if (tmp.length != 0) {
        // Step 2e - Select a random card from the array
        let randomCard = tmp.splice(Math.floor(Math.random() * tmp.length),1)

        // Step 2f - Add the card to the deck array
        deck.push(randomCard)
      }
    }
    
  }

  // Step 2g - Call the shuffleDeck function
  shuffleDeck()

  // Step 3a - Create an array to store 2 players
  var player1 = 0
  var player2 = 0
  var players = [player1, player2]

  // Step 3b - Create a variable to store the current player
  var currentPlayer = 0

  // Step 3c - Create a variable to store the first selected card
  var currentCard = null


  // Step 4 - Iterate through the deck and bind a click event to each one
  for(let card of deck) {
    // Step 4a - Create a new div element to be a card
    let cardEle = document.createElement('div')
    let cardEleValue = document.createElement('span')

    // Step 3b - Add a 'card' class to the class list on the new div element
    cardEle.classList.add('card')

    // Step 3c - Add a data value to the card with the card's value in it
    cardEleValue.dataset.value = card

    // Step 3c - Bind the cardSelected function
    // to the click event on the cardEle
    cardEle.addEventListener('click', cardSelected)
    //append cardEleValue to cardEle
    cardEle.appendChild(cardEleValue)
    //append cardEle to cards
    cards.appendChild(cardEle)
    
  }


  // Step 5 - Create a function to store the logic
  // for when a card is selected
  function cardSelected (event) {
    
    console.log(isFrozen)
    if(!isFrozen) {
      let clickedCard = event.target
      clickedCard.classList.add('rotated')
      console.log(event.target)
      let cardChildSpan = event.target.querySelector('span')
      //adding a bit of a delay so that after the card start rotating it's
      //value  does not appear instantly
      setTimeout(function() {
        cardChildSpan.textContent = cardChildSpan.dataset.value
      },100)
      event.target.removeEventListener('click', cardSelected)
      // Step 5a - Check if there is already a card selected
      if(currentCard != null) {
        console.log("Current card:",currentCard)
        // Step 6 - Compare the cards
        if(currentCard.querySelector('span').dataset.value === cardChildSpan.dataset.value) {
          console.log("Cards are equal")
          // Step 6b - Add a class to the 2 card elements
          // flipping them over
          currentCard.classList.add('flipped')
          currentCard.removeEventListener('click', cardSelected)
          event.target.classList.add('flipped')
          event.target.removeEventListener('click', cardSelected)       
          // Step 6c - Add a point to the score for this player
          players[currentPlayer] += 1
          score.textContent = `Player 1: ${players[0]} - Player 2: ${players[1]}`

          // Step 6d - Tell the player to go again
          // (use string interpolation to show which player you're addressing)
          message.textContent = 
          `Congratulations! Player ${currentPlayer+1}, please go again!`
          currentCard = null
          
        } else {
          isFrozen = true
          message.textContent = "Oh, so sorry!!! But yer' not psychic!"
          setTimeout(function () {
            cardChildSpan.textContent = ""
            event.target.addEventListener('click',cardSelected)
            console.log(event.target)
            currentCard.querySelector('span').textContent = ""
            currentCard.addEventListener('click', cardSelected)
            clickedCard.classList.remove('rotated') 
            currentCard.classList.remove('rotated')        
            
          }, 1700)
          // Step 6e - Provide a fail message to the player
          
          setTimeout(function() {
        
            // Step 6f - Using a ternary, change players
            currentPlayer = (currentPlayer === 0 ) ? 1 : 0

            // Step 6g - Concatenate a message to the message element
            // advising player 2 that it's their turn now
            // (use string interpolation to show which player you're addressing)
            message.textContent = `Player ${currentPlayer + 1}, it is your turn!`
            currentCard = null
            isFrozen = false
          }, 1750)
        }
      } else {
        // Step 5b - Assign the card to currentCard
        currentCard = event.target
        console.log("currentCard set to ",event.target)
        // Step 5c - Tell the player to select another card
        // (use string interpolation to show which player you're addressing)
        message.textContent = `Player ${currentPlayer+1}, please select another card`
      }

      // Step 7 - Check if the board is full
      if(players[0] + players[1] === deck.length/2) {
        // Step 7a - Check if one of the players has won
        if(players[0] != players[1]) {
          // Step 7b - Tell the player they've won
          // (use string interpolation to show which player you're addressing)
          message.textContent = `Player ${(players[0] > players[1]) ? 1 : 2}, you won!!! Congratulations!`
        } else {
          // Step 7c - Tell the players that the game has ended in a tie
          message.textContent = "The game was a tie! Nice try!"
        }

        //display the reset button
        reset.style.display = "flex"
      }
    } 
  }

  // Take it further - Reset the board allowing the user to play again (Worth 20% of the final grade)
  /*
    Step 1 - You will need a reset button in index.html
    Step 2 - You will need to bind an event listener
    
            that detects the click and executes a function
    Step 3 - You will need to reset all the pieces on the
            board
    Step 4 - You will need to reset the messages
    Step 5 - You will need to reset the players
  */

  reset.addEventListener('click', resetGame)

  function resetGame(event) {
    
    reset.style.display = "none"
    currentPlayer = 0
   

    while(cards.childElementCount > 0)
    {
      cards.removeChild(cards.lastChild)
    }

   

    players[0] = 0
    players[1] = 0
    
    message.textContent = "Click on a card to start"
    score.textContent = `Player 1: ${players[0]} - Player 2: ${players[1]}`
    
    displayDifficultySelection()

  }

}

function difficultySelection() {
  
  const easy = document.createElement('button')
  const medium = document.createElement('button')
  const hard = document.createElement('button')


  easy.type = "button"
  easy.id = "easy"
  easy.textContent = "Easy"
  easy.addEventListener('click', difficultyButtonClicked)
  gameboard.appendChild(easy)
  
  
  medium.type = "button"
  medium.id = "medium"
  medium.textContent = "Medium"
  medium.addEventListener('click', difficultyButtonClicked)
  gameboard.appendChild(medium)
  
  
  hard.type = "button"
  hard.id = "hard"
  hard.textContent = "Hard"
  hard.addEventListener('click', difficultyButtonClicked)
  gameboard.appendChild(hard)
}

function difficultyButtonClicked(event) {
  let difficulty = event.target.id
  hideDifficultySelection()
  StartGame(difficulty)

}

function hideDifficultySelection() {
  var easy = document.querySelector('#easy')
  var medium = document.querySelector('#medium')
  var hard = document.querySelector('#hard')   
  
  easy.style.display = "none"
  medium.style.display = "none"
  hard.style.display = "none"   
}

function displayDifficultySelection() {
  var easy = document.querySelector('#easy')
  var medium = document.querySelector('#medium')
  var hard = document.querySelector('#hard')    
  
  easy.style.display = "block"
  medium.style.display = "block"
  hard.style.display = "block"   
}