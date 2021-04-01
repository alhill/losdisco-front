import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'
import {
    BodyWrapper
} from '../library'
import { 
    Filter
} from '../components'
import {
    Table,
    Tag,
    Popover,
    Button,
    Input,
    message
} from 'antd'
import { EditOutlined, DeleteOutlined, ZoomInOutlined } from '@ant-design/icons'
import { GET_ALBUMS } from '../graphql/queries'
import { UPDATE_ALBUM, DELETE_ALBUM } from '../graphql/mutations'

const Home = () => {
    const [openPopover, setOpenPopover] = useState(false)
    const { data, loading } = useQuery(GET_ALBUMS, { fetchPolicy: "network-only" })
    const [updateAlbum, { loading: loadingUpdate }] = useMutation(UPDATE_ALBUM, { refetchQueries: [{ query: GET_ALBUMS }] })
    const [deleteAlbum, { loading: loadingDelete }] = useMutation(DELETE_ALBUM, { refetchQueries: [{ query: GET_ALBUMS }] })

    console.log(data)
    return (
        <BodyWrapper>
            <Filter />
            <Table 
                dataSource={data?.albums}
                loading={loading}
                rowKey="id"
                columns={[
                    {
                        key: "thumb",
                        render: it => <Thumb src={it?.thumb} />
                    },
                    {
                        title: "Nombre",
                        dataIndex: "title",
                        key: "title"
                    },
                    {
                        title: "Artista",
                        dataIndex: "artists_sort",
                        key: "artists_sort"
                    },
                    {
                        title: "Género",
                        key: "genre",
                        render: it => (
                            <TagWrapper>
                                {( it.genres || []).map((gnr, i) => <Tag key={"gnr" + i}>{gnr}</Tag>)}
                            </TagWrapper>
                        )
                    },
                    {
                        title: "Área",
                        key: "zone",
                        render: it => it?.zone?.name ?? "Sin ubicar"
                    },
                    {
                        key: "btn",
                        render: item => {
                            return (
                                <div key={item.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Tag 
                                        color="geekblue" 
                                        style={{ cursor: "pointer" }}
                                    ><EditOutlined /> Reubicar</Tag>
                                    <Popover 
                                        trigger="click" 
                                        visible={openPopover === "delete"+item.id}
                                        onVisibleChange={bool => setOpenPopover(bool && "delete"+item.id)}
                                        placement="left" 
                                        content={
                                            <div>
                                                <p>¿Estás seguro de que deseas eliminar el álbum <b>{item.title}</b>?</p>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <Button type="default" onClick={() => setOpenPopover(false)}>Cancelar</Button>&nbsp;&nbsp;
                                                    <Button 
                                                        type="primary" 
                                                        style={{ filter: "hue-rotate(150deg)" }}
                                                        loading={loadingDelete}
                                                        onClick={async () => {
                                                            try{
                                                                await deleteAlbum({ variables: { id: item.id }})
                                                                message.success("Se ha borrado el álbum correctamente")
                                                            } catch(err) {
                                                                message.error("Ocurrió un error durante el borrado del álbum")
                                                            }
                                                            setOpenPopover(false)
                                                        }}
                                                    >Eliminar</Button>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <Tag color="volcano" style={{ cursor: "pointer" }}><DeleteOutlined /> Eliminar</Tag>
                                    </Popover>
                                    <Tag color="success"><ZoomInOutlined /> Ver detalles</Tag>
                                </div>
                            )
                        }
                    }
                ]}
            />
        </BodyWrapper>
    )
}

const Thumb = styled.img`
    width: 50px;
    height: 50px;
    min-height: 50px;
    border-radius: 3px;
    object-fit: cover;
    transition: all 300ms;
    &:hover{
        position: relative;
        z-index: 1000000;
        transform: scale(5) translateX(15px);
    }
`
const TagWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 50px;
`

export default Home