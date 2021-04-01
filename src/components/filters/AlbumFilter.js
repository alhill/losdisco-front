import { Input } from 'antd'
import React from 'react'
import styled from 'styled-components'

const AlbumFilter = () => {
    return (
        <Wrapper>
            <Title>Nombre del álbum</Title>
            <Input />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    padding: 10px;
`
const Title = styled.span``

export default AlbumFilter