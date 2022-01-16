import React, { FC, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";

import { projectsListItems } from "./listItems";
import Footer from "../Footer";
import { connect, useDispatch } from "react-redux";
import { createContext, useEffect } from "react";
import LogoutButton from "components/LogoutButton";
import { NavBar } from "components/AppBar";
import Drawer from "@mui/material/Drawer";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { StateProps } from "store";
import { createProject, getAllProjects, setActiveProject } from "store/project/thunks";
import { ProjectProps as Project, ProjectProps } from "core/entities";
import { ProjectStateProps } from "store/project/reducer";
import CreateEntry from "components/CreateEntry";
import { CircularProgress } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';


const drawerWidth = 240;

const mdTheme = createTheme();
export const ProjectContext: React.Context<Project> = createContext({});


const Projects: FC<{
  error?: string,
  loading: boolean,
  projects: { [key: number]: ProjectStateProps },
  activeProjectId?: number,
  parentId?: number,
}> = ({
  error,
  loading,
  projects,
  activeProjectId
}) => {
    const dispatch = useDispatch();
    const { projectId: id } = useParams();
    useEffect(() => {
      dispatch(getAllProjects());
      if (id !== undefined) {
        dispatch(setActiveProject(parseInt(id, 10)));
      }
    }, []);
    const createProjectCallback = (e: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name")?.valueOf().toString() || "";
      dispatch(createProject({ name } as ProjectProps));
    };
    const [searching, setSearching] = useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const matches = useMediaQuery(mdTheme.breakpoints.up('sm'));

    const handleDrawerToggle = () => { setMobileOpen(!mobileOpen); };
    useEffect(() => { setSearching(false); }, [projects]);


    return (
      <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <NavBar
          appBarStyles={{
            position: "fixed",
            sx: {
              zIndex: mdTheme.zIndex.drawer + 1,
            },
          }}
          title="Projects"
          toggleButtonCallback={handleDrawerToggle}
        >
          <LogoutButton />
        </NavBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {matches ?
            <Drawer
              variant="permanent"
              sx={{
                display: 'block',
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              <Toolbar />
              {loading
                ? <Box sx={{ mx: 'auto', p: 1, m: 1, borderRadius: 1 }}><CircularProgress /></Box>
                : <List className="ll">
                  {projectsListItems({ searching, setSearching, projects, dispatch, error, activeProjectId })}
                  <CreateEntry
                    onSubmit={createProjectCallback}
                    initValue=""
                    id="name"
                    label='Enter new project'
                  />
                </List>
              }
              <Divider />
            </Drawer>
            : <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              sx={{
                display: 'block',
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              <Toolbar />
              {loading
                ? <Box sx={{ mx: 'auto', p: 1, m: 1, borderRadius: 1 }}><CircularProgress /></Box>
                : <List className="ll">
                  {projectsListItems({ searching, setSearching, projects, dispatch, error, activeProjectId })}
                  <CreateEntry
                    onSubmit={createProjectCallback}
                    initValue=""
                    id="name"
                    label='Enter new project'
                  />
                </List>
              }

              <Divider />
            </Drawer>}
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, marginLeft: { sm: `${drawerWidth}px` }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Container>
            {activeProjectId === undefined &&
              <Box sx={{ mx: 'auto', p: 1, m: 1, borderRadius: 1, textAlign: 'center', }}>
                Select a project to begin.
              </Box>}
            {activeProjectId !== undefined &&
              <Outlet context={{ projects, activeProjectId }} />}
            <Footer sx={{ pt: 4 }} />
          </Container>
        </Box>
      </ThemeProvider >
    );
  };

interface ProjectComponentState {
  projects: { [key: number]: ProjectStateProps; },
  activeProjectId: number,
  parentId?: number
}
export const useActiveProject: () => ProjectComponentState = () => {
  return useOutletContext<ProjectComponentState>();
};

const mapStateToProps = (state: StateProps) => {
  const {
    project_state: { loading, projects, error, active },
  } = state;
  const activeProjectId = active !== undefined ? active.id : undefined;
  const parentId = active !== undefined ? active.parent_id : undefined;
  return { error, loading, projects, activeProjectId, parentId };
};

export default connect(mapStateToProps)(Projects);
