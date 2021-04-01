import React from 'react'
import styled from 'styled-components'

const BodyWrapper = ({ children, style }) => {
    return (
        <Wrapper style={style}>
            { children }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    padding: 1em;
`

export default BodyWrapper