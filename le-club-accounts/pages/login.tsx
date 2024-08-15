import { RouteComponentProps } from '@reach/router';
import styles from './login.module.scss';

export default function Login(props: RouteComponentProps) {
  return <>
    <div className={styles.logo}></div>
    <h1>Welcome!</h1>
    <h2>Please, login or register.</h2>
    <form target="/" method="POST">
      <input type="text"></input>
      <input type="text"></input>
      <input type="submit"></input>
    </form>
  </>
}
