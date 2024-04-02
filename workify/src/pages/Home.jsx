import React from 'react'
import styled from 'styled-components'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Features from './Features'
import Team from '../components/Team'
import Benefits from './Benifits'
import About from './About'
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import { useState } from 'react'
import { Modal} from '@mui/material'
import { CloseRounded } from '@mui/icons-material'

const Body = styled.div`
    background: #13111C;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
`
const Wrapper = styled.div`
  width: 430px;
  height: min-content;
  border-radius: 16px;
  margin:auto;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 10px;
  display: flex;
  margin-top: 80px;
  flex-direction: column;
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 12px;
`;

const Container = styled.div`
    width: 100%;
    background-Image: linear-gradient(38.73deg, rgba(204, 0, 187, 0.25) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.25) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Top = styled.div`
width: 100%;
display: flex;
padding-bottom: 50px;
flex-direction: column;
align-items: center;
background: linear-gradient(38.73deg, rgba(204, 0, 187, 0.15) 0%, rgba(201, 32, 184, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
clip-path: polygon(0 0, 100% 0, 100% 100%,50% 95%, 0 100%);
@media (max-width: 768px) {
    clip-path: polygon(0 0, 100% 0, 100% 100%,50% 98%, 0 100%);
    padding-bottom: 0px;
}
`;
const Content = styled.div`
    width: 100%;
    height: 100%;
    background: #13111C;
    display: flex;
    flex-direction: column;
`

const Desc = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.soft2};
  margin-top: 8px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* number of lines to show */
  line-clamp: 5;
  -webkit-box-orient: vertical;
`;


const Home = () => {
    const [SignInOpen, setSignInOpen] = React.useState(false);
    const [SignUpOpen, setSignUpOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = useState(true);

    return (
        <Body>
            <Container>
                <Top>
                    <Hero setSignInOpen={setSignInOpen} />
                </Top>
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    {/* <Container> */}
                        <Wrapper>
                        <CloseRounded
                            sx={{ fontSize: "22px" }}
                            style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            cursor: "pointer",
                            }}
                            onClick={() => setModalOpen(false)}
                        />
                        <Title>Website is under Developement</Title>
                        <Desc> You can test current website status using below test credentials</Desc>
                        <Desc> Email : abc1@gmail.com</Desc>
                        <Desc> Password : Abc@1234</Desc>
                        </Wrapper>
                    {/* </Container> */}
                </Modal>
                <Content>
                    {/* <Features /> */}
                    {/* <Testimonials/> */}
                    {/* <Benefits /> */}
                    {/* <Faq/> */}
                    {/* <Team /> */}

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Footer />
                    </div>
                </Content>
                {SignUpOpen && (
                    <SignUp setSignUpOpen={setSignUpOpen} setSignInOpen={setSignInOpen} />
                )}
                {SignInOpen && (
                    <SignIn setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
                )}
            </Container>
        </Body>
    )
}

export default Home