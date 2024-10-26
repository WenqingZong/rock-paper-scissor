import { html, render } from 'lit-html';
import { hello_backend } from 'declarations/hello_backend';
import rockImg from '../assets/rock.png';
import paperImg from '../assets/paper.png';
import scissorImg from '../assets/scissor.png';

const determineWinner = (userOptionIndex, robotOptionIndex) => {
    const options = ['rock', 'paper', 'scissors'];
    
    const userOption = options[userOptionIndex];
    const robotOption = options[robotOptionIndex];
    
    // Map of winning conditions
    const winConditions = {
        rock: 'scissors',
        scissors: 'paper',
        paper: 'rock'
    };

    if (userOption === robotOption) {
        return "It's a draw!";
    } else if (winConditions[userOption] === robotOption) {
        return "You Win!";
    } else {
        return "You Lose!";
    }
}

class App {
  choice = '';
  robot_choice = '';
  options = ['rock', 'paper', 'scissors'];


  constructor() {
    this.#render();
  }

  #handleImageClick = async (imageName) => {
	const userOptionIndex = this.options.indexOf(imageName);
	
	// Get the robot's choice
	this.robot_choice = await hello_backend.get_random_choice();
	let robot_move = this.options[this.robot_choice];
	console.log("robot choice: ", robot_move);
	
	this.choice = determineWinner(userOptionIndex, this.robot_choice);
	
	this.#render();
  };

  #addEventListeners() {
    document.getElementById("rock").addEventListener('click', () => this.#handleImageClick('rock'));
    document.getElementById("paper").addEventListener('click', () => this.#handleImageClick('paper'));
    document.getElementById("scissor").addEventListener('click', () => this.#handleImageClick('scissor'));

    const images = document.getElementsByTagName('img');
    for (let img of images) {
      img.addEventListener('mouseover', (e) => e.target.style.border = '2px solid green');
      img.addEventListener('mouseout', (e) => e.target.style.border = '2px solid transparent');
    }
  }

  #render() {
	const robotImage = this.robot_choice !== '' ? html`
            <div class="robot-answer">
                <h2>Robot has chosen: ${this.options[this.robot_choice]}</h2>
                <img src="${this.robot_choice === 0 ? rockImg : this.robot_choice === 1 ? paperImg : scissorImg}" alt="${this.options[this.robot_choice]}" class="option-img" />
            </div>
        ` : '';

	let resultClass = '';
	if (this.choice.includes('Win')) {
		resultClass = 'win';   // Green for win
	} else if (this.choice.includes('Lose')) {
		resultClass = 'lose';  // Red for lose
	} else if (this.choice.includes('draw')) {
		resultClass = 'draw';   // Yellow for draw
	}

    let body = html`
      <main>
		<h1>Please choose your move:</h1>
        <div class="images-container">
          <img id="rock" src="${rockImg}" alt="rock" class="option-img" />
          <img id="paper" src="${paperImg}" alt="paper" class="option-img" />
          <img id="scissor" src="${scissorImg}" alt="scissor" class="option-img" />
        </div>
        <section class="result-text ${resultClass}">${this.choice}</section>
		${robotImage}
      </main>
    `;
    
    render(body, document.getElementById('root'));
    
    this.#addEventListeners();
  }
}

export default App;
