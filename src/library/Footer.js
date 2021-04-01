import React from 'react'
import styled from 'styled-components'

const Footer = () => {
    return (
        <Wrapper>
            <span>
                &reg; 2021 - &nbsp;
            </span>
            <a href="https://alhill.dev">Al Hill Development</a>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    height: 2em;
    background: white;
    box-shadow: 0px -2px 10px 2px rgba(0, 0, 0, 0.1);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
    a{
        color: rgba(0, 0, 0, 0.8);
        text-decoration: none;
        transition: all 300ms;
        &:hover{
            color: rgba(0, 0, 0, 0.6);
        }
    }
`

export default Footer