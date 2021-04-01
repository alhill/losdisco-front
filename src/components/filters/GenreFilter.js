import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { xorBy } from 'lodash'
import { Button } from 'antd'

const genres = [
    {
        name: "rock",
        image: ""
    },
    {
        name: "folk",
        image: ""
    },
    {
        name: "pop",
        image: ""
    },
    {
        name: "jazz",
        image: ""
    },
    {
        name: "metal",
        image: ""
    },
    {
        name: "classical",
        image: ""
    },
    {
        name: "latin",
        image: ""
    },
    {
        name: "monguer",
        image: ""
    },
]


const GenreFilter = () => {
    const [selected, setSelected] = useState([])
    useEffect(() => {
        console.log(selected)
    }, [selected])
    return (
        <Wrapper>
            <Title>Selecciona uno o más géneros</Title>
            <Button onClick={() => setSelected([])}>Desactivar todos</Button>
            <GenreWrapper>
                { genres.map((gnr, i) => {
                    return (
                        <Genre key={"gnr-" + i} selected={selected.find(sgnr => sgnr.name === gnr.name)} onClick={() => setSelected(xorBy(selected, [gnr], "name"))}>{gnr.name}</Genre>
                    )
                })}
            </GenreWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`

`
const GenreWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
`
const Title = styled.span`
    padding: 0 2em 0 10px;

`
const Genre = styled.div`
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    text-align: right;
    line-height: 1.1em;
    padding: 0 10px 6px 0;
    height: 70px;
    width: 120px;
    border-radius: 4px;
    border: 1px solid rgba(150, 200, 255, 0.4);
    margin: 5px;
    transition: all 300ms;
    background-color: ${({ selected }) => selected ? "rgba(150, 200, 255, 0.3)" : "white"};
    transform: scale(${({ selected }) => selected ? 1.05 : 1});
    &:hover{
        background-color: ${({ selected }) => selected ? "rgba(150, 200, 255, 0.3)" : "rgba(150, 200, 255, 0.15)"};
    }
`

export default GenreFilter