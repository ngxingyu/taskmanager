import { TaskProps } from 'core/entities'
import React, { ChangeEventHandler, FC, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
// import { TaskProps } from "core/entities"
import { useParams } from 'react-router-dom'
import { getProjectById } from 'store/project/thunks'
import { useActiveProject } from '.'
import { AnyAction, Dispatch } from 'redux'
import { createTask } from 'store/tasks/thunks'
import { ThunkAction } from 'redux-thunk'
import { Box, Input, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'

// type ProjectProps = { id: number, tasks: TaskProps[] }
const Project = () => {
  // const props = useContext(ProjectContext)
  const activeProject = useActiveProject()
  const dispatch = useDispatch()
  const { projectId: id } = useParams()
  const projectId: number | undefined = id === undefined ? id : parseInt(id, 10)
  useEffect(() => {
    dispatch(getProjectById((projectId !== undefined && projectId) || -1, 2))
  }, [dispatch])
  const submitCallback = useCallback(
    (t: TaskProps) => (projectId === undefined ? false : dispatch(createTask(projectId, t))),
    [projectId]
  )
  return (
    <>
      {activeProject !== undefined && (
        <Stack>
          <ProjectDescription title={activeProject.name} />
          <Tasks tasks={activeProject.tasks} />
          {/* <Tasks1 tasks={activeProject.tasks} /> */}
          <TaskCreate onSubmit={submitCallback} project_id={projectId!} parent_id={null} />
        </Stack>
      )}
    </>
  )
}

const ProjectDescription = ({ title }: { title: string }) => {
  return <h1>{title}</h1>
}

const Tasks = ({ tasks }: { tasks: TaskProps[] }) => {
  return (
    <List>
      {tasks.map((t, i) => {
        return (
          <ListItem key={i}>
            <Stack direction="row" spacing={2}>
              <ListItemText primary={`Id: ${t.id || ''}`} />
              <ListItemText primary={`Parent: ${t.parent_id || ''}`} />
              <ListItemText primary={`Title: ${t.title || ''}`} />
              <ListItemText primary={`Notes: ${t.notes || ''}`} />
            </Stack>
          </ListItem>
        )
      })}
    </List>
  )
}
// const Tasks1 = ({ tasks }: { tasks: TaskProps[] }) => {
//   const [expanded, setExpanded] = React.useState([]);
//   const [selected, setSelected] = React.useState([]);

//   const handleToggle = (event, nodeIds) => {
//     setExpanded(nodeIds);
//   };

//   const handleSelect = (event, nodeIds) => {
//     setSelected(nodeIds);
//   };

//   const handleExpandClick = () => {
//     setExpanded((oldExpanded) =>
//       oldExpanded.length === 0 ? ['1', '5', '6', '7'] : [],
//     );
//   };

//   const handleSelectClick = () => {
//     setSelected((oldSelected) =>
//       oldSelected.length === 0 ? ['1', '2', '3', '4', '5', '6', '7', '8', '9'] : [],
//     );
//   };
//   return (
//     <TreeView
//       aria-label="controlled"
//       defaultCollapseIcon={<ExpandMoreIcon />}
//       defaultExpandIcon={<ChevronRightIcon />}
//       expanded={expanded}
//       selected={selected}
//       onNodeToggle={handleToggle}
//       onNodeSelect={handleSelect}
//       multiSelect
//     >
//       {tasks.map((t, i) => {
//         return (
//           <ListItemButton key={i} onClick={() => handleClick(v.id || -1)}>
//             <ListItemText primary={v.name || ''} />
//           </ListItemButton>
//         )
//       })}
//     </TreeView>
//   )
// }

const TaskCreate = ({
  onSubmit,
  project_id,
  parent_id = null,
}: {
  onSubmit: (d: TaskProps) => false | ThunkAction<Promise<void>, {}, {}, AnyAction>
  project_id: number
  parent_id: number | null
}) => {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title')?.valueOf().toString() || ''
    dispatch(createTask(project_id, { parent_id, title } as TaskProps))
    setValue('')
  }, [])
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.currentTarget.value)
  }, [])
  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <TextField
        name="title"
        required
        fullWidth
        id="title"
        label="Enter New Task"
        value={value}
        onChange={handleChange}
        autoFocus
      />
    </Box>
  )
}

export default Project
