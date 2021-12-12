import { TaskProps } from 'core/entities'
import React, { FC, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { TaskProps } from "core/entities"
import { useParams } from 'react-router-dom'
import { getProjectById } from 'store/project/thunks'
import { useActiveProject } from '.'
import { AnyAction, Dispatch } from 'redux'
import { createTask } from 'store/tasks/thunks'
import { ThunkAction } from 'redux-thunk'

// type ProjectProps = { id: number, tasks: TaskProps[] }
const Project = () => {
  // const props = useContext(ProjectContext)
  const activeProject = useActiveProject()
  const dispatch = useDispatch()
  const { projectId } = useParams()

  useEffect(() => {
    dispatch(getProjectById((projectId !== undefined && parseInt(projectId, 10)) || -1))
  }, [dispatch])
  const submitCallback = useCallback(
    (t: TaskProps) =>
      projectId === undefined ? false : dispatch(createTask(parseInt(projectId, 10), t)),
    [projectId]
  )
  return (
    <>
      {activeProject !== undefined && (
        <>
          <ProjectDescription title={activeProject.name} />
          <Tasks tasks={activeProject.tasks} />
          <TaskCreate onSubmit={submitCallback} />
        </>
      )}
    </>
  )
}

const ProjectDescription = ({ title }: { title: string }) => {
  return <h1>{title}</h1>
}

const Tasks = ({ tasks }: { tasks: TaskProps[] }) => {
  return <p>{tasks.toString()}</p>
}

const TaskCreate = ({
  onSubmit,
}: {
  onSubmit: (d: TaskProps) => false | ThunkAction<Promise<void>, {}, {}, AnyAction>
}) => {
  return <>Create Task</>
}

export default Project
