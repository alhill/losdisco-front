import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
    FilterDetails
} from '../components'

const Filter = () => {
    const [selectedFilter, setSelectedFilter] = useState("artist")

    return (
        <Wrapper>
            <Title>Filtrar por:</Title>
            <FilterSelector>
                <Btn selected={selectedFilter === "artist"} onClick={() => setSelectedFilter("artist")}>Artista</Btn>
                <Btn selected={selectedFilter === "album"} onClick={() => setSelectedFilter("album")}>Álbum</Btn>
                <Btn selected={selectedFilter === "genre"} onClick={() => setSelectedFilter("genre")}>Género</Btn>
                <Btn selected={selectedFilter === "area"} onClick={() => setSelectedFilter("area")}>Área</Btn>
            </FilterSelector>
            <FilterDetails
                filterType={selectedFilter}
            />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin-bottom: 1em;
`
const Title = styled.div`
    margin-bottom: 0.5em;
`
const FilterSelector = styled.div`
    display: flex;
    margin-bottom: 1em;
    & > div:not(last-child){
        margin-right: 1em;
    }
`

const Btn = styled.div`
    cursor: pointer;
    min-height: 25px;
    width: 100px;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid ${({ selected }) => selected ? "rgba(150, 200, 255, 0.4)" : "gainsboro"};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms;
    background-color: ${({ selected }) => selected ? "rgba(150, 200, 255, 0.4)" : "white"};
    &:hover{
        background-color: ${({ selected }) => selected ? "rgba(150, 200, 255, 0.4)" : "rgba(0, 0, 0, 0.03)"};
    }
`

export default Filter