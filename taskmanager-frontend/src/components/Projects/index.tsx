import React, { FC } from "react";
import { createTheme, ThemeProvider, Theme } from "@mui/material/styles";
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
import { createProject, getAllProjects, getProjectById } from "store/project/thunks";
import { ProjectProps as Project, ProjectProps } from "core/entities";
import { ProjectStateProps } from "store/project/reducer";
import CreateEntry from "components/CreateEntry";
import { CircularProgress } from "@mui/material";

const drawerWidth = 240;

const mdTheme = createTheme();
export const ProjectContext: React.Context<Project> = createContext({});


const Projects: FC<{
  error?: string,
  loading: boolean,
  projects: { [key: number]: ProjectStateProps },
  activeProjectId?: number
}> = ({
  error,
  loading,
  projects,
  activeProjectId
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getAllProjects());
    }, []);
    const { projectId: _projectId } = useParams();
    const projectId: number | undefined = _projectId === undefined ? _projectId : parseInt(_projectId, 10);
    useEffect(() => {
      dispatch(getProjectById((projectId !== undefined && projectId) || -1, 5));
    }, [projectId]);
    const createProjectCallback = (e: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name")?.valueOf().toString() || "";
      dispatch(createProject({ name } as ProjectProps));
    };
    return (
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <NavBar
            appBarStyles={{
              position: "fixed",
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
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            <Toolbar />
            {loading
              ? <Box sx={{ mx: 'auto', p: 1, m: 1, borderRadius: 1 }}><CircularProgress /></Box>
              : <List className="ll">
                {projectsListItems({ loading, projects, dispatch, error, activeProjectId })}
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
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              {activeProjectId === undefined &&
                <Box sx={{ mx: 'auto', p: 1, m: 1, borderRadius: 1, textAlign: 'center', }}>
                  Select a project to begin.
                </Box>}
              <Outlet context={{ projects, activeProjectId }} />
              <Footer sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  };

interface ProjectComponentState {
  projects: { [key: number]: ProjectStateProps; },
  activeProjectId: number
}
export const useActiveProject: () => ProjectComponentState = () => {
  return useOutletContext<ProjectComponentState>();
};

const mapStateToProps = (state: StateProps) => {
  const {
    project_state: { loading, projects, error, active },
  } = state;
  const activeProjectId = active !== undefined ? active.id : undefined;
  return { error, loading, projects, activeProjectId };
};

export default connect(mapStateToProps)(Projects);
