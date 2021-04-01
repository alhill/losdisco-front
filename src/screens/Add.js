import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Spin, Table, Input, Tag, Descriptions, Carousel, message } from 'antd'
import styled from 'styled-components'
import BodyWrapper from '../library/BodyWrapper'
import Modal from 'antd/lib/modal/Modal'
import _ from 'lodash'
import { useMutation } from '@apollo/client'
import { CREATE_ALBUM } from '../graphql/mutations'
import { GET_ALBUMS } from '../graphql/queries'

const Add = () => {
    const detailsOpen = useRef()
    const carousel = useRef()
    const [searchParam, setSearchParam] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [detailModal, setDetailModal] = useState({ show: false })
    const [detailData, setDetailData] = useState()
    const [loadingDetails, setLoadingDetails] = useState()
    const [videoModal, setVideoModal] = useState({ show: false })
    const [imageModal, setImageModal] = useState({ show: false })

    const [createAlbum, { loading: loadingCreate }] = useMutation(CREATE_ALBUM, { refetchQueries: [{ query: GET_ALBUMS }] })

    useEffect(() => {
        if(searchParam){
            searchIt()
        }
    }, [page, pageSize])

    useEffect(() => {
        console.log(results)
    }, [results])

    useEffect(() => {
        if(detailModal?.show && (detailModal.show !== detailsOpen)){
            detailsOpen.current = true
            searchDetails(detailModal?.id)
        }
    }, [detailModal])

    const searchIt = async () => {
        setLoading(true)
        const resp = await fetch(`https://api.discogs.com/database/search?q=${searchParam}&per_page=${pageSize}&page=${page}&type=release` , {
            headers: { "Authorization": "Discogs token=" + process.env.REACT_APP_DISCOGS_TOKEN }
        })
        const data = await resp.json()
        setResults(data)
        setLoading(false)
    }

    const searchDetails = async id => {
        setLoadingDetails(true)
        const resp = await fetch(`https://api.discogs.com/releases/${id}` , {
            headers: { "Authorization": "Discogs token=" + process.env.REACT_APP_DISCOGS_TOKEN }
        })
        const data = await resp.json()
        console.log(data)
        setDetailData(data)
        setLoadingDetails(false)
    }

    const handleAdd = async item => {
        console.log(item)
        console.log({
            artists: item.artists,
            extraartists: item.extraartists
        })
        const resp = await createAlbum({ variables: {
            title: item.title,
            //zone,
            artists_sort: item.artists_sort,
            extraartists: item.extraartists,
            full_artist_list: [...new Set([...item.artists, ...item.extraartists].map(it => it.name))],
            album_format: _.upperFirst(item.formats.map(f => f.name === "Vinyl" ? "Vinilo" : f.name).find(f => ["Vinilo", "CD", "Cassette"].includes(f))),
            genres: item.genres,
            images: item.images,
            labels: item.labels,
            master_url: item.master_url,
            notes: item.notes,
            release: item.release,
            resource_url: item.resource_url,
            styles: item.styles,
            thumb: item.thumb,
            tracklist: item.tracklist,
            uri: item.uri,
            year: item.year
        }})
        if(resp){
            message.success("El álbum se ha añadido correctamente a tu colección")
            setDetailModal({ show: false })
        } else {
            message.error("Algo pocho pasó")
        }
    }

    return (
        <BodyWrapper>
            <SearchBox>
                <Label>Buscar artistas o álbumes</Label>
                <Input style={{ width: 300, marginRight: "1em" }} value={searchParam} onChange={evt => setSearchParam(evt.target.value)} onPressEnter={() => searchIt()} />
                <Button onClick={() => searchIt()} icon={<SearchOutlined />}>Buscar</Button>
            </SearchBox>

            <Table
                loading={loading}
                pagination={{
                    defaultCurrent: 1,
                    total: results?.pagination?.pages * results?.pagination?.per_page,
                    onShowSizeChange: (page, size) => setPageSize(size),
                    onChange: page => setPage(page)
                }}
                columns={[
                    {
                        key: "thumbnail",
                        render: it => <Thumb src={it.thumb || process.env.REACT_APP_ALBUM_PLACEHOLDER} />
                    },
                    {
                        title: 'Título',
                        dataIndex: 'title',
                        key: 'title',
                    },
                    {
                        title: "Año",
                        dataIndex: "year",
                        key: "year",
                        render: year => year || "-"
                    },
                    {
                        title: "Género",
                        key: "genre",
                        render: it => (
                            <TagWrapper>
                                {( it.genre || []).map((gnr, i) => <Tag key={"gnr" + i}>{gnr}</Tag>)}
                            </TagWrapper>
                        )
                    },
                    {
                        title: "Formato",
                        key: "format",
                        render: it => {
                            const eng = _.get(it, "format", []).find(f => ["Vinyl", "CD", "Cassette"].includes(f))
                            if(eng === "Vinyl"){ return "Vinilo" }
                            else{ return eng}
                        }
                    },
                    {
                        title: "Estilo",
                        key: "style",
                        render: it => (
                            <TagWrapper>
                                {( it.style || []).map((style, i) => <Tag key={"style" + i}>{style}</Tag>)}
                            </TagWrapper>
                        )
                    },
                    {
                        key: "btn",
                        render: it => <Button onClick={() => {
                            setDetailModal({ show: true, id: it.id })
                        }}>Detalles</Button>
                    }
                ]}
                rowKey="id"
                dataSource={results?.results || []}
            />
            <Modal
                width="80%"
                visible={detailModal?.show}
                onCancel={() => setDetailModal({ show: false })}
                cancelText="Cerrar"
                okText="Añadir"
                onOk={() => handleAdd(detailData)}
                confirmLoading={loadingCreate}
            >
                { loadingDetails ? <Spin /> : (
                    <Descriptions
                        labelStyle={{ fontWeight: "bold "}}
                        bordered="true"
                        column={1}
                        title={<div>
                            <Thumb src={detailData?.thumb || process.env.REACT_APP_ALBUM_PLACEHOLDER} />
                            <span style={{ marginLeft: "1em" }}>{ detailData?.title }</span>
                        </div>}
                    >
                        <Descriptions.Item label="Lanzamiento">{ detailData?.released }</Descriptions.Item>
                        <Descriptions.Item label="Artistas">{ (detailData?.artists || []).reduce((acc, it) => acc + ", " + it.name, "").slice(2) }</Descriptions.Item>
                        {(detailData?.extraartists || []).length > 0 && (
                            <Descriptions.Item label="Otros artistas">{ detailData?.extraartists.reduce((acc, it) => acc + ", " + it.name, "").slice(2) }</Descriptions.Item>
                        )}
                        <Descriptions.Item label="Lista de canciones">
                            <ul style={{ padding: 0 }}>
                                { (detailData?.tracklist || []).map(track => <li style={{ listStyle: "none" }}>{track.position && (track.position + " - ")}{ track?.title }</li>) }
                            </ul>
                        </Descriptions.Item>
                        {(detailData?.videos || []).filter(v => v.embed).length > 0 && (
                            <Descriptions.Item label="Vídeos">
                                <ul style={{ padding: 0 }}>
                                    {(detailData?.videos || []).filter(v => v.embed).map((v, i) => (
                                        <li 
                                            key={"video-" + i}
                                            style={{ 
                                                listStyle: "none", 
                                                color: "dodgerblue", 
                                                cursor: "pointer" 
                                            }} 
                                            onClick={() => {
                                                console.log(v.uri)
                                                setVideoModal({ 
                                                    show: true, 
                                                    uri: (v.uri || "").replace("watch?v=", "embed/"),
                                                })
                                            }}
                                        >{v.title}</li>
                                    ))}
                                </ul>
                            </Descriptions.Item>
                        )}
                        {(detailData?.images || []).length > 0 && (
                            <Descriptions.Item label="Imágenes"><Button onClick={() => setImageModal({ show: true, images: detailData?.images })}>Ver imágenes</Button></Descriptions.Item>
                        )}
                        {(detailData?.genre || []).length > 0 && (
                            <Descriptions.Item label="Género">{(detailData?.genres || []).map((gnr, i) => <Tag key={"gnr-m-" + i}>{gnr}</Tag>) }</Descriptions.Item>
                        )}
                        {(detailData?.styles || []).length > 0 && (
                            <Descriptions.Item label="Estilo">{(detailData?.styles || []).map((style, i) => <Tag key={"style-m-" + i}>{style}</Tag>) }</Descriptions.Item>
                        )}
                    </Descriptions>
                )}
            </Modal>
            <Modal
                visible={videoModal?.show}
                onCancel={() => setVideoModal({ show: false })}
                width="640px"
                bodyStyle={{ height: 360, padding: 0 }}
                footer={null}
                closeIcon={null}
                destroyOnClose={true}
            >
                <VideoWrapper>
                    <Close onClick={() => setVideoModal({ show: false })}>&times;</Close>
                    <iframe 
                        id="ytplayer" 
                        type="text/html"
                        width="640" 
                        height="360"
                        src={ videoModal?.uri }
                        frameborder="0"
                    />
                </VideoWrapper>
            </Modal>
            <Modal
                visible={imageModal?.show}
                onCancel={() => setImageModal({ show: false })}
                width="500px"
                bodyStyle={{ height: 490, padding: 0 }}
                footer={null}
                closeIcon={<span></span>}
            >
                <ImageWrapper>
                    <Close onClick={() => setVideoModal({ show: false })}>&times;</Close>
                    <Prev onClick={() => carousel.current.prev()}>&lt;</Prev>
                    <Next onClick={() => carousel.current.prev()}>&gt;</Next>
                    <Carousel
                        ref={carousel}
                    >
                        {(imageModal?.images || []).map((img, i) => <img style={{
                            maxHeight: 500,
                            width: "100%",
                            objectFit: "contain"
                        }} src={img.uri} key={"img-" + i} /> )}
                    </Carousel>
                </ImageWrapper>
            </Modal>
        </BodyWrapper>
    )
}

const VideoWrapper = styled.div`
    position: relative;
`
const Prev = styled.div`
    position: absolute;
    width: 40px;
    height: 100%;
    line-height: 500px;
    cursor: pointer;
    top: 0px;
    z-index: 10;
    left: 0;
    text-align: center;
    color: gainsboro;
    font-weight: bold;
    font-size: 2em;
`
const Next = styled.div`
    position: absolute;
    width: 40px;
    height: 100%;
    line-height: 500px;
    cursor: pointer;
    top: 0px;
    z-index: 10;
    right: 0;
    text-align: center;
    color: gainsboro;
    font-weight: bold;
    font-size: 2em;
`
const ImageWrapper = styled.div`
    background-color: black;
    position: relative;
    .slick-slider, .slick-list, .slick-track{
        max-height: 500px;
    }
`
const Close = styled.div`
    position: absolute;
    color: white;
    top: -40px;
    right: -30px;
    font-size: 2em;
    cursor: pointer;
`

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1em;
`
const Label = styled.span`
    margin-right: 1em;
`

const Thumb = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 3px;
    object-fit: cover;
`
const TagWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`

export default Add