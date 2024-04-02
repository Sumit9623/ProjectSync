import React from 'react'
import styled from 'styled-components'
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSelector } from 'react-redux/es/hooks/useSelector';
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { Link } from 'react-router-dom';


const Container = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius:5px;
  @media (max-width: 768px) {
    padding: 0px 20px !important;
  }
`;
const Logo = styled.h1`
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.primary};
`;

const IcoButton = styled(IconButton)`
  color: ${({ theme }) => theme.textSoft} !important;
  margin-right:20px !important;
`;

const Menu = styled.ul`
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled.a`
  font-size: 16px;
  text-decoration: none;
  font-weight: 500;
  color:  ${({ theme }) => theme.itemText};
  cursor: pointer;
  transition: all 0.3s ease;
  margin:0px 10px;
  &:hover {
    color: ${({ theme }) => theme.itemHover};
  }
`;



const Button = styled.button`
  padding: 5px 18px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  border-radius: 100px;
  transition: all 0.3s ease;
  margin-right:10px;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};
  }
`;

const Image = styled.img`
  height: 40px;
`;


const Navbar = ({ setSignInOpen, setMenuOpen, menuOpen }) => {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container>
      <Menu>
        <MenuItem>
          <Link
            to="home"
            style={{ textDecoration: "none", color: "inherit" }}
          >Home
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            to="features"
            style={{ textDecoration: "none", color: "inherit" }}
          >Features
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            to="benifits"
            style={{ textDecoration: "none", color: "inherit" }}
          >Benifits
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
              to="aboutus"
              style={{ textDecoration: "none", color: "inherit" }}
            >About Us
          </Link>
        </MenuItem>
      </Menu>
      {currentUser ?
        <IcoButton onClick={() => setMenuOpen(!menuOpen)}>
          <MenuIcon fontSize='large'/>
        </IcoButton>
        :
        <Button onClick={() => setSignInOpen(true)}>
          <AccountCircleOutlinedIcon /> Sign In
        </Button>
      }

    </Container>
  )
}

export default Navbar