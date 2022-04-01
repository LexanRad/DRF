import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {BrowserRouter, Route, Link} from 'react-router-dom'

import UserList from './components/User.js';
import MenuItem from "./components/Menu";
import FooterItem from "./components/Footer";
import ProjectList from "./components/Projects";
import TodoList from "./components/TODOs";
import ProjectDetails from "./components/ProjectDetails";
import Cookies from "universal-cookie/lib";
import LoginForm from "./components/Auth";


class App extends React.Component {
   constructor(props) {
       super(props)
       this.state = {
           'user': [],
           'projects':[],
           'todos':[]
       }
   }

   logout() {
        this.setToken('');
    }

    getToken(username, password) {
        console.log(this);
        console.log(username, password);
        axios.post(
            'http://127.0.0.1:8000/api-auth-token/',
            {username: username, password: password}
        ).then(response => {
            this.setToken(response.data['token'])
        }).catch(error => alert('Неверный логин или пароль'))
    }

    getTokenFromStorage() {
        const cookies = new Cookies()
        const token = cookies.get('token')
        console.log("token", token);
        this.setState({'token': token}, () => this.loadData())
    }

    setToken(token) {
        const cookies = new Cookies()
        cookies.set('token', token)
        this.setState({'token': token}, () => this.loadData())
    }

    loadData() {
        if (!this.isAuthenticated()) {
            return;
        }
        const headers = this.getHeaders()
        axios.get('http://127.0.0.1:8000/api/users', {headers}).then(
            response => {
                const users = response.data.results
                this.setState(
                    {'users': users}
                )
            }
        ).catch(error => console.log(error))
        axios.get('http://127.0.0.1:8000/api/projects', {headers}).then(
            response => {
                const projects = response.data.results
                this.setState(
                    {'projects': projects}
                )
            }
        ).catch(error => console.log(error))
        axios.get('http://127.0.0.1:8000/api/todo', {headers}).then(
            response => {
                const todos = response.data.results
                this.setState(
                    {'todos': todos}
                )
            }
        ).catch(error => console.log(error))

    }

    getHeaders() {
        let headers = {
            'Content-Type': 'application/json'
        }
        if (this.isAuthenticated()) {
            headers['Authorization'] = `Token ${this.state.token}`;
        }
        return headers
    }

    isAuthenticated() {
        return this.state.token !== '';
    }

   componentDidMount() {
       this.getTokenFromStorage();
}

   render () {
       return (
           <div className={'App'}>
              <BrowserRouter>
                    <nav>
                        <ul>
                            <li>
                                <Link to={'/'}>User</Link>
                            </li>
                            <li>
                                <Link to={'/projects'}>Projects</Link>
                            </li>
                            <li>
                                <Link to={'/todos'}>Todos</Link>
                            </li>
                        </ul>
                    </nav>
                    <Route exact path='/' component={() => <UserList users={this.state.users}/>}/>
                    <Route exact path='/projects' component={() => <ProjectList projects={this.state.projects}/>}/>
                    <Route exact path='/todos' component={() => <TodoList todos={this.state.todos}/>}/>
                    <Route exact path='/projects/:id/' component={() => <ProjectDetails projects={this.state.projects}/>}/>
                </BrowserRouter>
           </div>
       )
   }
}


export default App;
