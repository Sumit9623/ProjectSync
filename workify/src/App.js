import logo from './logo.svg';
import { ThemeProvider } from "styled-components";
import { useState } from "react";
import { darkTheme, lightTheme } from "./utils/Theme";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import styled from 'styled-components';
import Dashboard from './pages/Dashboard';
import Task from './pages/Tasks';
import Issues from './pages/Issues';
import IssuesDetails from './pages/IssueDetails'
import Projects from './pages/Projects';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProjectDetails from './pages/ProjectDetails';
import ToastMessage from './components/ToastMessage';
import { useSelector } from "react-redux";
import AddNewTeam from './components/AddNewTeam';
import { useEffect } from 'react';
import Home from './pages/Home';
import ProjectInvite from './components/ProjectInvite';
import TeamInvite from './components/TeamInvite';
import TeamDetails from "./pages/TeamDetails"
import TaskDetails from "./pages/TaskDetails"
import Features from './pages/Features';
import AddNewProject from './components/AddNewProject';

const Container = styled.div`
height: 100vh;
  display: flex;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  overflow-x: hidden;
`;

const Main = styled.div`
  flex: 7;
`;
const Wrapper = styled.div`
  padding: 0% 1%;
  overflow-y: scroll !important;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);
  const [newTeam, setNewTeam] = useState(false);
  const [newProject, setNewProject] = useState(false);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [loading, setLoading] = useState(false);


  const { currentUser } = useSelector(state => state.user);


  //set the menuOpen state to false if the screen size is less than 768px
  useEffect(() => {
    console.log("I am in use Effect");
    const resize = () => {
      if (window.innerWidth < 1110) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <BrowserRouter>
          {currentUser ?
            <Container >
              {loading ? <div>Loading...</div> : <>
                {menuOpen && <Menu  setMenuOpen={setMenuOpen} setDarkMode={setDarkMode} darkMode={darkMode} setNewTeam={setNewTeam} />}
                <Main>
                   <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                  <Wrapper>
                    <Routes>
                        <Route exact path="/" element={<Dashboard />} />
                        <Route path='profile' element={<h1>Profile Page</h1>}></Route>
                        <Route path="projects">
                          <Route path='' element={<h1>Project List</h1>}></Route>
                          <Route path=":id" element={<ProjectDetails />} />
                          <Route path="invite/:code" element={<ProjectInvite />} />
                        </Route>
                        <Route path="teams">
                          <Route path='' element={<h1>Team List</h1>}></Route>
                          <Route path=":id" element={<TeamDetails/>} />
                          <Route path="invite/:code" element={<TeamInvite />} />
                        </Route>
                        <Route path="tasks">
                          <Route path='' element={<h1>Task List</h1>}></Route>
                          <Route path=':id' element={<TaskDetails/>} />
                        </Route>
                        <Route path="issues">
                          <Route path='' element={<h1>Issues List</h1>}></Route>
                          <Route path=':id' element={<IssuesDetails/>} />
                        </Route>
                        <Route path='home' element={<h1>Profile Page</h1>}></Route>
                        <Route path='features' element={<Features></Features>}></Route>
                        <Route path='benifits' element={<h1>Profile Page</h1>}></Route>
                        <Route path='aboutus' element={<h1>Profile Page</h1>}></Route>
                        <Route path="*" element={<div>Not Found</div>} />
                    </Routes>
                  </Wrapper>
                </Main>
              </>}
            </Container>
            : <Home></Home>}
          {open && <ToastMessage open={open} message={message} severity={severity} />}
        </BrowserRouter>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;
