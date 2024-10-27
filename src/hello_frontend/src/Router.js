import App from './App';
import Experiment from './Experiment';

class Router {
  constructor() {
    this.route(window.location.pathname);
    this.#addPopStateListener();
  }

  route(path) {
    const rootElement = document.getElementById('root');
    const experimentElement = document.getElementById('experiment-root');

    if (path === '/') {
      experimentElement.innerHTML = '';
      new App();
    } else if (path === '/experiment') {
      rootElement.innerHTML = '';
      new Experiment();
    } else {
      this.renderNotFound();
    }
  }

  renderNotFound() {
    const body = html`
      <main>
        <h1>404 - Page Not Found</h1>
        <a href="/">Go back to Home</a>
      </main>
    `;
    render(body, document.getElementById('root'));
  }

  #addPopStateListener() {
    window.addEventListener('popstate', () => {
      this.route(window.location.pathname);
    });
  }
}

export default Router;
