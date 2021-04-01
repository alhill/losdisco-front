import React from 'react'
import { BodyWrapper } from '../library'
import styled from 'styled-components'

const FourOhFour = () => {
    return (
        <BodyWrapper>
            <Wrapper>
                <h1>404</h1>
                <img src="404.gif" />
                <p>Lo que quiera que busques aquí no está</p>
            </Wrapper>
        </BodyWrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    h1{
        font-size: 5em;
    }
    img{
        border-radius: 4px;
        box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.1);
        margin-bottom: 1em;
    }
`
export default FourOhFour