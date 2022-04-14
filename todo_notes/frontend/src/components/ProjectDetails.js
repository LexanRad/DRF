import React from "react";
import {useParams} from "react-router-dom";

import UserItem from './UserItem.js'
import ProjectItem from './ProjectItem.js'
import TodoItem from './TodoItem.js'


const ProjectDetail = ({projects, users, todo}) => {
    let {id} = useParams();
    console.log('project_id = ',{id})

    let filterproject = projects.filter((item) => item.id == id);
    let filtertodo = todo.filter((item) => item.project == id);
    let filterusers = users.filter(user => filterprojects[0].users.includes(parseInt(user.id)))

    return (
        <div>
            <h1>Проект:</h1>
            <table>
                <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Репозиторий</th>
                        <th>Участники</th>
                    </tr>
                </thead>
                <tbody>
                    {filterprojects.map((project)=> <ProjectItem project={project} users={users} />)}
                </tbody>
            </table>

            <h1>Заметки:</h1>
            <table>
                <thead>
                    <tr>
                        <th>Проект</th>
                        <th>пользователь-создатель</th>
                        <th>заголовок</th>
                        <th>заметка</th>
                        <th>Активность</th>
                    </tr>
                </thead>
                <tbody>
                    {filtertodo.map((todo)=> <TodoItem todo={todo} users={users}/>)}
                </tbody>
            </table>
            <h1>Пользователи:</h1>
            <table>
                <thead>
                    <tr>
                        <th>UserName</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filterusers.map((user)=> <UserItem user={user}/>)}
                </tbody>
            </table>

        </div>
    )
}

export default ProjectDetail;