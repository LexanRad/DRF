import React from "react";

const TodoItem = ({todo}) => {
    return (
        <tr>
            <td>{todo.user}</td>
            <td>{todo.description}</td>
            <td>{todo.active}</td>
            <td>{todo.project}</td>
        </tr>
    )
}

const TodoList = ({todos}) => {
    return (
        <table>
            <thead>
            <tr>
                <th>User</th>
                <th>Description</th>
                <th>Active</th>
                <th>Project</th>
            </tr>
            </thead>
            <tbody>
            {todos.map((todo) => <TodoItem key={todo.id} todo={todo}/>)}
            </tbody>
        </table>
    )
}

export default TodoList;