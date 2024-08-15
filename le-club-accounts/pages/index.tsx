import { Router, Link } from '@reach/router';
import Home from './home';
import Login from './login';

export default function Index() {
  return (
    <Router>
      <Home path="/" />
      <Login path="/login" />
    </Router>
  );
}
