import React from 'react';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { projectsListItems } from './listItems';
import Footer from "../Footer";
import { useDispatch, useSelector } from 'react-redux';
import { PermissionProps, ProjectProps, TaskProps } from 'core/entities';
import { createContext, useEffect } from 'react';
import LogoutButton from 'components/LogoutButton';
import { NavBar } from 'components/AppBar';
import Drawer from '@mui/material/Drawer';
import { Outlet, useOutletContext } from 'react-router-dom';
import { StateProps } from 'store';
import { getAllProjects } from 'store/project/thunks';

const drawerWidth = 240;

const mdTheme = createTheme();
export const ProjectContext: React.Context<ProjectProps> = createContext({});

const Projects = () => {
    const dispatch = useDispatch();
    const { error, loading, projects, activeProject } =
        useSelector<StateProps,
            {
                error?: string, loading: boolean, projects: { [key: number]: ProjectProps },
                activeProject?: {
                    id: number,
                    permissions: PermissionProps[],
                    tasks: TaskProps[]
                }
            }>(
                state => ({
                    error: state.project_state.error,
                    loading: state.project_state.loading,
                    projects: state.project_state.projects,
                    activeProject: state.project_state.active
                })
            );
    useEffect(() => {
        dispatch(getAllProjects());
    }, [dispatch]);


    return <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <NavBar appBarStyles={{
                position: "fixed",
                sx: {
                    zIndex: (theme: Theme) => theme.zIndex.drawer + 1.
                }
            }} title="Projects">

                <LogoutButton />
            </NavBar>
            <Drawer variant="permanent" sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}>
                <Toolbar />
                <List className="ll">{
                    projectsListItems({ loading, projects, dispatch, error })}</List>
                <Divider />
            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                {/* <ProjectContext.Provider value={{ id: activeProject!.id, tasks: activeProject!.tasks }}> */}
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    {(!activeProject === undefined) &&
                        <Grid container spacing={3}>
                            {/* {outlet} */}
                            <Outlet context={[activeProject]} />
                        </Grid>
                    }
                    <Footer sx={{ pt: 4 }} />
                </Container>
                {/* </ProjectContext.Provider> */}
            </Box>
        </Box>
    </ThemeProvider >
}
export const useActiveProject = () => {
    return useOutletContext<ProjectProps>();
}


export default Projects;