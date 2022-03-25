import React from "react";
import {useParams} from "react-router-dom";


const ProjectItem = ({project}) => {
    return (
        <tr>
            <td>HELLO DETAIL PROJECT</td>
            <td>{project.id}</td>
            <td>{project.name}</td>
            <td>{project.repository}</td>
        </tr>
    )
}

const ProjectDetail = ({projects}) => {
    let {id} = useParams();
    let filterproject = projects.filter((project) => project.id === +id);
    return (
        <table>
            <thead>
            <tr>
                <th>DETAIL</th>
                <th>ID</th>
                <th>Project</th>
                <th>URL</th>
            </tr>
            </thead>
            <tbody>
            {filterproject.map((project) => <ProjectItem key={project.id} project={project}/>)}
            </tbody>
        </table>
    )
}
export default ProjectDetail;