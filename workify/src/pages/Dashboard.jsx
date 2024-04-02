
import React from "react";
import { useState, useEffect } from "react";
import ProjectCard from "../components/Card";
import Styled, { useTheme } from "styled-components";
import ProjectStatCard from "../components/ProjectStatCard";
import { Add } from "@mui/icons-material";
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import { useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LinearProgress } from "@mui/material";
import { statuses, data, tagColors } from "../data/data";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import { getProjects } from "../api";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const Container = Styled.div`
@media screen and (max-width: 480px) {
  padding: 10px 10px;
}
`;

const Section = Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
`;

const Left = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
  flex: 1.4;
`;

const Right = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
`;

const TopBar = Styled.div`
  width:40%;
  padding:4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CreateButton = Styled.div`
  padding: 10px 10px;
  text-align: left;
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  background: linear-gradient(76.35deg, #801AE6 15.89%, #A21AE6 89.75%);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    background: linear-gradient(76.35deg, #801AE6 15.89%, #A21AE6 89.75%);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  }
  gap: 14px;

  ${({ btn }) =>
    btn === "team" &&
    `
    background: linear-gradient(76.35deg, #FFC107 15.89%, #FFC107 89.75%);
    &:hover {
      background: linear-gradient(76.35deg, #FFC107 15.89%, #FFC107 89.75%);
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
    }
  `}
`;

const Icon = Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  padding: 4px;
`;

const StatsWrapper = Styled.div`
  // display: grid;
  // grid-template-columns: repeat(3, minmax(100px,100px,1fr));
  display:flex;
  gap: 10px;
  margin: 20px 0px;
`;

const StatCard = Styled.div`
  width: 100%;
  height: 100%;
  padding: 4px;
  text-align: left;
  margin: 2px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.20);
  transition: all 0.5s ease;
  &:hover {
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  }
`;

const RecentProjects = Styled.div`
  // width: 100%;
  height: 100%;
  text-align: left;
  margin: 2px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
`;

const SectionTitle = Styled.div`
  // width: 100%;
  padding: 0px 12px;
  font-size: 22px;
  font-weight: 600;
  margin: 10px 0px 16px 0px;
  color: ${({ theme }) => theme.text};
`;

const RecentProjectsWrapper = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
`;


const Teams = Styled.div`
  width: 100%;
`;

const TotalProjects = Styled.div`
  width: 100%;
  padding: 8px 12px;
`;

const TaskCompleted = Styled.div`
  width: 100%;
  padding: 8px 12px;
`;

const Progress = Styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 0px 0 0;
`;

const ProgressText = Styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Desc = Styled.div`
  font-size: 12px;
  font-weight: 500;
  padding: 0px 4px;
  line-spacing: 1.5;
  font-size: 13px;
  color: ${({ theme }) => theme.soft2};
`;

const TotalWorks = Styled.div`
  width: 100%;
  padding: 8px 12px;
`;

const Title = Styled.div`
  width: 100%;
  height: 100%;
  text-align: left;
  margin: 2px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Span = Styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const CardWrapper = Styled.div`
padding: 12px 0px;
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
grid-gap: 8px;
`;

const Tasks = Styled.div`
  // width: 100%;
  padding: 4px;
  text-align: left;
  margin: 2px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.card};
`;

const TaskCardWrapper = Styled.div`
  padding: 12px 0px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 8px;
`;

function CircularProgressWithLabel(props
) {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} thickness={6} size="60px" style={{ color: theme.primary }} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="inherit"
        >{`${Math.round(props.value)}`}</Typography>
      </Box>
    </Box>
  );
}

// backgroundColor: 'lightyellow',
// '& .MuiLinearProgress-bar': {
//   backgroundColor: 'orange'
// }

const Dashboard = () => {

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const token = localStorage.getItem("token");


  return (
    <Container>
        <Section>
          <h1>Dashboard</h1>
        </Section>
    </Container >
  );
};

export default Dashboard;
