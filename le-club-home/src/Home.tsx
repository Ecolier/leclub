import { RouteComponentProps } from '@reach/router';
import './Home.css';

function Home(props: RouteComponentProps) {

  return (
    <div className="home">
      <div className="logo"></div>
      <h1 className="welcome">Vos services reprennent <span className="soon">bientôt !</span></h1>
    </div>
  );
}

export default Home;
