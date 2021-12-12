import React from 'react'
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { projectsListItems } from './listItems'
import Footer from '../Footer'
import { connect, useDispatch } from 'react-redux'
import { createContext, useEffect } from 'react'
import LogoutButton from 'components/LogoutButton'
import { NavBar } from 'components/AppBar'
import Drawer from '@mui/material/Drawer'
import { Outlet, useOutletContext } from 'react-router-dom'
import { StateProps } from 'store'
import { getAllProjects } from 'store/project/thunks'
import { ActiveProjectState } from 'store/project/reducer'
import { UserRole, PermissionProps, ProjectProps, TaskProps } from 'core/entities'


const drawerWidth = 240

const mdTheme = createTheme()
export const ProjectContext: React.Context<ProjectProps> = createContext({})

interface ProjectsProps {
  error?: string
  loading: boolean
  projects: { [key: number]: ProjectProps }
  activeProject?: ProjectComponentState
}

const Projects = ({error, loading, projects, activeProject}:ProjectsProps) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllProjects())
  }, [dispatch])

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <NavBar
          appBarStyles={{
            position: 'fixed',
            sx: {
              zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
            },
          }}
          title="Projects"
        >
          <LogoutButton />
        </NavBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <List className="ll">{projectsListItems({ loading, projects, dispatch, error })}</List>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Outlet context={activeProject} />
            </Grid>
            <Footer sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

interface ProjectComponentState {
  id: number
  tasks: TaskProps[]
  created_at?: Date
  updated_at?: Date
  permissions?: UserRole[]
  name: string
}
export const useActiveProject = () => {
  return useOutletContext<ProjectComponentState | undefined>()
}


const mapStateToProps = (state: StateProps) => {
  const {
    project_state: {
      loading,
      projects,
      error,
      active
    }
  } = state
  const activeProject = active!==undefined ? {
    id: active.id,
    tasks: active.tasks,
    ...projects[active.id]
  } as ProjectComponentState : undefined
  return {error, loading, projects, activeProject}
}

export default connect(mapStateToProps)(Projects)
