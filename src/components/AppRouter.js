import React from 'react'
import styled from 'styled-components'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import {
    Home,
    Add,
    Areas,
    FourOhFour
} from '../screens'
import { 
    Header,
    Footer 
} from '../library'

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Wrapper>
                <Header />
                <Body>
                    <InnerBody>
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route exact path="/add">
                                <Add />
                            </Route>
                            <Route exact path="/areas">
                                <Areas />
                            </Route>
                            <Route path="">
                                <FourOhFour />
                            </Route>
                        </Switch>
                    </InnerBody>
                    <Footer />
                </Body>
            </Wrapper>
        </BrowserRouter>
    )
}

const Wrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`

const Body = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`
const InnerBody = styled.div`
    flex: 1;
`

export default AppRouter