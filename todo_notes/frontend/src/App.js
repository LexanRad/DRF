import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {HashRouter, BrowserRouter, Route, Link, Switch} from 'react-router-dom'

import UserList from './components/User.js';
import UserDetail from './components/UserDetail.js';
import MenuItem from "./components/Menu";
import FooterItem from "./components/Footer";
import ProjectList from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import ProjectForm from './components/ProjectForm.js';
import ProjectUpdate from './components/ProjectUpdate.js';
import TodoList from "./components/TODOs";
import TodoForm from './components/TodoForm.js';
import Cookies from "universal-cookie/lib";
import LoginForm from "./components/Auth";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'users': [],
            'projects': [],
            'todo': [],
            'token': '',
            'username': '',
        }
    }

    set_token(token) {
        const cookies = new Cookies()
        cookies.set('token', token)
        this.setState({'token': token}, () => this.load_data())
    }

    get_token_from_storage() {
        const cookies = new Cookies()
        const token = cookies.get('token')
        this.setState({'token': token}, () => this.load_data())
    }

    is_authenticated() {
        return !!this.state.token
    }

    logout() {
        this.set_token('')
        this.setState({'username': ''})
    }

    get_token(username, password) {
        axios.post('http://127.0.0.1:8000/api-token-auth/', {username: username, password: password})
        .then(response => {
            console.log(response.data)
            this.set_token(response.data['token'])
            this.setState({'username': username})
            console.log(this.state.username)
        }).catch(error => alert('Неверный логин или пароль'))
    }

    get_headers() {
        let headers = {
            'Accept':'application/json; version=v2',
            'Content-Type':'application/json'
        }
        if (this.is_authenticated()){
                headers['Authorization'] = 'Token ' + this.state.token
            }
        return headers
    }

    componentDidMount() {
        this.get_token_from_storage()
    }

    load_data() {
        const headers = this.get_headers()
        axios.get('http://127.0.0.1:8000/api/users/', {headers})
            .then(response => {
                const users = response.data.results
                this.setState(
                            {
                               'users': users
                            }
                )
            }).catch(error => {
                                this.setState({users:[]})
                                console.log(error)
                                }
                )
        axios.get('http://127.0.0.1:8000/api/projects/', {headers})
            .then(response => {
                const projects = response.data.results
                this.setState(
                            {
                               'projects': projects
                            }
                )
            }).catch(error => {
                                this.setState({projects:[]})
                                console.log(error)
                                }
                )
        axios.get('http://127.0.0.1:8000/api/todo/', {headers})
            .then(response => {
                const todo = response.data.results
                this.setState(
                            {
                               'todo': todo
                            }
                )
            }).catch(error => {
                                this.setState({todo:[]})
                                console.log(error)
                                }
                )
    }

    createProject (name, repository_url, users) {
        const headers = this.get_headers()
        const data = {name: name, repository_url: repository_url, users: users}
        console.log(data)
        axios.post('http://127.0.0.1:8000/api/projects/', data, {headers})
            .then(response => {
                this.load_data()
            }).catch(error => {console.log(error)})
    }

    updateProject (id, name, repository_url, users) {
        const headers = this.get_headers()
        const data = {id: id, name: name, repository_url: repository_url, users: users}
        console.log('data before update',data)
        axios.put(`http://127.0.0.1:8000/api/projects/${id}/`, data, {headers})
            .then(response => {
                this.load_data()
            }).catch(error => {console.log(error)})
    }

    deleteProject (id) {
        const headers = this.get_headers()
        console.log('Id deleted project =', id)
        axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {headers})
            .then(response => {
                this.load_data()
            }).catch(error => {console.log(error)})
    }

    createTodo (project, user, title, text) {
        const headers = this.get_headers()
        const data = {project: project, user: user, title: title, text: text}
        console.log('data = ', data)
        axios.post('http://127.0.0.1:8000/api/todo/', data, {headers})
            .then(response => {
                this.load_data()
            }).catch(error => {console.log(error)})
    }

    deleteTodo (id) {
        const headers = this.get_headers()
        console.log('Id deleted todo =', id)
        axios.delete(`http://127.0.0.1:8000/api/todo/${id}`, {headers})
            .then(response => {
                this.load_data()
            }).catch(error => {console.log(error)})
    }

    render () {
        return (
            <div>
                <HashRouter>
                    <MenuItem />

                    {this.is_authenticated() ?
                        <button type="button" class="btn btn-info" onClick={() => this.logout()}>Logout {this.state.username}</button> :
                        <button type="button" class="btn btn-info"><Link to='/login'>Login</Link></button>
                    }
                    <Switch>
                        <Route exact path='/' component={() => <UserList users={this.state.users} />} />
                        <Route exact path='/projects' component={() => <ProjectList projects={this.state.projects} users={this.state.users} deleteProject={(id)=>this.deleteProject(id)} updateProject={(id)=>this.updateProject(id)} />} />
                        <Route exact path='/todo' component={() => <TodoList todo={this.state.todo} users={this.state.users} deleteTodo={(id)=>this.deleteTodo(id)} />} />
                        <Route exact path='/todo/create' component={() => <TodoForm projects={this.state.projects} users={this.state.users} createTodo={(project,user,title,text) => this.createTodo(project,user,title,text)} />} />
                        <Route exact path='/project/:id'>
                            <ProjectDetails projects={this.state.projects} users={this.state.users} todo={this.state.todo} />
                        </Route>
                        <Route exact path='/projects/create' component={() => <ProjectForm users={this.state.users} createProject={(name,repository_url,users) => this.createProject(name,repository_url,users)} />} />
                        <Route exact path='/project/update/:id' component={() => <ProjectUpdate projects={this.state.projects}  users={this.state.users} updateProject={(id,name,repository_url,users) => this.updateProject(id,name,repository_url,users)} />} />
                        <Route exact path='/user/:id'>
                            <UserDetail all_obj={this.state} />
                        </Route>
                    </Switch>
                </HashRouter>
                <FooterItem />
            </div>
        )
    }
}

export default App;
