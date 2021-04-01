import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import AlbumFilter from './filters/AlbumFilter'
import AreaFilter from './filters/AreaFilter'
import ArtistFilter from './filters/ArtistFilter'
import GenreFilter from './filters/GenreFilter'

const FilterDetails = ({ filterType }) => {
    const [boxHeight, setBoxHeight] = useState("150px")
    const [filter, setFilter] = useState(<div></div>)
    const lastType = useRef()

    const dict = {
        album: {
            component: <AlbumFilter />,
            height: "80px"
        },
        artist: {
            component: <ArtistFilter />,
            height: "80px"
        },
        area: {
            component: <AreaFilter />,
            height: "230px"
        },
        genre: {
            component: <GenreFilter />,
            height: "230px"
        }
    }

    useEffect(() => {
        if(!lastType.current){ 
            lastType.current = filterType 
            setBoxHeight(dict[filterType]?.height)
            setFilter(dict[filterType]?.component)
        }
        else{
            if(lastType !== filterType){
                setBoxHeight("0px")
                setTimeout(() => {
                    setBoxHeight(dict[filterType]?.height)
                    lastType.current = filterType
                    setFilter(dict[filterType]?.component)
                }, 300)
            }
        }
    }, [filterType])

    return (
        <Wrapper height={boxHeight}>
            {filter}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    transition: all 300ms;
    height: ${({ height }) => height};
    overflow: hidden;
`

export default FilterDetails