import { html, render } from 'lit-html';
import { hello_backend } from 'declarations/hello_backend';
import Chart from 'chart.js/auto';

class Experiment {
  results = { rock: 0, paper: 0, scissors: 0 };
  count = 0;
  maxCalls = 0;
  chart = null;

  constructor() {
    this.#render();
  }

  #handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue > 0) {
      this.maxCalls = parseInt(inputValue);
    }
  };

  #handleStartClick = async () => {
    if (this.maxCalls > 0) {
      this.#runExperiment();
    }
  };

  async #runExperiment() {
    this.results = { rock: 0, paper: 0, scissors: 0 };
    this.count = 0;

    // Initialize the chart if not already initialized
    if (!this.chart) {
      this.#initializeChart();
    }

    while (this.count < this.maxCalls) {
      const robotChoice = await hello_backend.get_random_choice();

      switch (robotChoice) {
        case 0:
          this.results.rock++;
          break;
        case 1:
          this.results.paper++;
          break;
        case 2:
          this.results.scissors++;
          break;
      }

      this.count++;

      this.#updateChart();
      this.#render();
    }
  }

  #initializeChart() {
    const ctx = document.getElementById('resultChart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Rock', 'Paper', 'Scissors'],
        datasets: [{
          label: '# of Choices',
          data: [this.results.rock, this.results.paper, this.results.scissors],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  #updateChart() {
    this.chart.data.datasets[0].data = [this.results.rock, this.results.paper, this.results.scissors];
    this.chart.update();
  }

  #renderProgressBar() {
    return html`
      <div class="progress-container">
        <progress id="progress-bar" value="${this.count}" max="${this.maxCalls}"></progress>
        <span class="progress-text">${this.count} / ${this.maxCalls}</span>
      </div>
    `;
  }

  #renderResultTable() {
    return html`
      <table class="result-table">
        <tr>
          <th>Option</th>
          <th>Count</th>
        </tr>
        <tr>
          <td>Rock</td>
          <td>${this.results.rock}</td>
        </tr>
        <tr>
          <td>Paper</td>
          <td>${this.results.paper}</td>
        </tr>
        <tr>
          <td>Scissors</td>
          <td>${this.results.scissors}</td>
        </tr>
      </table>
    `;
  }

  #render() {
    let body = html`
      <main>
        <h1>Experiment</h1>
        <div>
          <label for="input-calls">Enter number of calls:</label>
          <input type="number" id="input-calls" min="1" @input="${this.#handleInputChange}" />
          <button @click="${this.#handleStartClick}">Start Experiment</button>
        </div>
        ${this.#renderProgressBar()}
        ${this.#renderResultTable()}
        <canvas id="resultChart"></canvas>
      </main>
    `;

    render(body, document.getElementById('experiment-root'));

    if (!this.chart) {
      this.#initializeChart();
    }
  }
}

export default Experiment;
