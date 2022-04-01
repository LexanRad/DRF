import React from 'react';


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    handlerOnChange(event) {
        console.log(event.target);
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handlerOnSubmit(event) {
        console.log('submit', this.state);
        this.props.getToken(this.state.username,
            this.state.password);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={(event) => this.handlerOnSubmit(event)}>
                <input type="text" name="username"
                       onChange={(event) => this.handlerOnChange(event)}/>
                <input type="password" name="password"
                       onChange={(event) => this.handlerOnChange(event)}/>
                <input type="submit" value="login"/>
            </form>
        )
    }
}

export default LoginForm;
