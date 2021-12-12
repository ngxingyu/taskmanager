
import React, { FC } from "react";
import { TaskProps } from "core/entities"
import { useParams } from "react-router-dom";
import { useActiveProject } from "."

type ProjectProps = { id: number, tasks: TaskProps[] }
const Project: FC<ProjectProps> = () => {
    // const props = useContext(ProjectContext)
    const activeProject = useActiveProject();
    // const dispatch = useDispatch();
    const { projectId } = useParams();
    // useEffect(() => {
    //     console.log(`project ${projectId}`);
    //     // dispatch(getProjectById(projectId !== undefined &&
    //     //     parseInt(projectId) || -1))
    // }, [dispatch]);
    return (
        <>
            {projectId}
            <div>Hello</div>
            {activeProject.id}
        </>
    )
}

export default Project

