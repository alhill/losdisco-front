import React, { useState } from 'react'
import styled from 'styled-components'
import { xorBy } from 'lodash'
import { Button } from 'antd'
import { useQuery } from '@apollo/client'
import { GET_ZONES } from '../../graphql/queries'


const AreaFilter = () => {
    const { data } = useQuery(GET_ZONES)
    const [selected, setSelected] = useState([])

    return (
        <Wrapper>
            <Title>Selecciona uno o más áreas</Title>
            <Button onClick={() => setSelected([])}>Desactivar todas</Button>
            <AreaWrapper>
                { (data?.zones || []).map((ar, i) => {
                    return (
                        <Area key={"area-" + i} selected={selected.find(sar => sar.name === ar.name)} onClick={() => setSelected(xorBy(selected, [ar], "name"))}>{ar.name}</Area>
                    )
                })}
            </AreaWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`

`
const AreaWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
`
const Title = styled.span`
    padding: 0 2em 0 10px;

`
const Area = styled.div`
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

export default AreaFilter